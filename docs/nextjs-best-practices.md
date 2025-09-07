# Next.js App Router ベストプラクティス

## 目次

1. [プロジェクト構造](#プロジェクト構造)
2. [ルーティング](#ルーティング)
3. [データフェッチング](#データフェッチング)
4. [コンポーネント設計](#コンポーネント設計)
5. [状態管理](#状態管理)
6. [パフォーマンス最適化](#パフォーマンス最適化)
7. [SEO とメタデータ](#seoとメタデータ)
8. [エラーハンドリング](#エラーハンドリング)
9. [セキュリティ](#セキュリティ)
10. [テスト](#テスト)

## プロジェクト構造

### 推奨ディレクトリ構造

```
src/
├── app/                    # App Routerのルート
│   ├── globals.css
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── loading.tsx        # グローバルローディング
│   ├── error.tsx          # グローバルエラー
│   ├── not-found.tsx      # 404ページ
│   └── (routes)/          # ルートグループ
│       ├── dashboard/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── settings/
│       └── auth/
├── components/            # 再利用可能なコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── forms/            # フォーム関連
│   └── layout/           # レイアウト関連
├── lib/                  # ユーティリティ関数
├── hooks/                # カスタムフック
├── types/                # TypeScript型定義
└── styles/               # スタイルファイル
```

### ファイル命名規則

- **pages**: `page.tsx`
- **layouts**: `layout.tsx`
- **loading states**: `loading.tsx`
- **error boundaries**: `error.tsx`
- **not found**: `not-found.tsx`
- **route handlers**: `route.ts`

## ルーティング

### Route Groups の活用

```typescript
// app/(dashboard)/analytics/page.tsx
export default function AnalyticsPage() {
  return <div>Analytics</div>;
}

// app/(auth)/login/page.tsx
export default function LoginPage() {
  return <div>Login</div>;
}
```

### 動的ルート

```typescript
// app/posts/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PostPage({ params, searchParams }: PageProps) {
  return <div>Post: {params.slug}</div>;
}

// 複数の動的セグメント
// app/shop/[...segments]/page.tsx
export default function ShopPage({
  params,
}: {
  params: { segments: string[] };
}) {
  return <div>Segments: {params.segments.join("/")}</div>;
}
```

### Parallel Routes

```typescript
// app/dashboard/@analytics/page.tsx
export default function Analytics() {
  return <div>Analytics Component</div>;
}

// app/dashboard/@team/page.tsx
export default function Team() {
  return <div>Team Component</div>;
}

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {analytics}
      {team}
    </div>
  );
}
```

## データフェッチング

### Server Components でのデータフェッチ

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts", {
    // キャッシュ戦略の明示
    next: { revalidate: 3600 }, // 1時間でキャッシュ更新
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post: Post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### データフェッチングパターン

```typescript
// 並列データフェッチ
async function getPostAndComments(id: string) {
  const [post, comments] = await Promise.all([
    fetch(`/api/posts/${id}`).then(res => res.json()),
    fetch(`/api/posts/${id}/comments`).then(res => res.json()),
  ]);

  return { post, comments };
}

// 順次データフェッチ（依存関係がある場合）
async function getUserAndPosts(userId: string) {
  const user = await fetch(`/api/users/${userId}`).then(res => res.json());
  const posts = await fetch(`/api/users/${userId}/posts`).then(res =>
    res.json()
  );

  return { user, posts };
}
```

### Route Handlers（API Routes）

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  try {
    // データベースクエリ
    const posts = await db.post.findMany({
      where: query
        ? {
            title: { contains: query, mode: 'insensitive' },
          }
        : {},
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = postSchema.parse(body);

    const post = await db.post.create({
      data: validatedData,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## コンポーネント設計

### Server vs Client Components

```typescript
// Server Component（デフォルト）
// app/components/PostList.tsx
async function PostList() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Client Component
// app/components/SearchBox.tsx
("use client");

import { useState } from "react";

export default function SearchBox({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
      placeholder="Search posts..."
    />
  );
}
```

### Composition Pattern

```typescript
// app/components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg border bg-card ${className}`}>{children}</div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pb-4">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-0">{children}</div>;
}

// 使用例
function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <h3>{post.title}</h3>
      </CardHeader>
      <CardContent>
        <p>{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
```

## 状態管理

### Client State

```typescript
// app/components/Counter.tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Server State (React Query 推奨)

```typescript
// app/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1分
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// app/hooks/usePosts.ts
("use client");

import { useQuery } from "@tanstack/react-query";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });
}
```

## パフォーマンス最適化

### 画像最適化

```typescript
import Image from "next/image";

function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        priority={product.featured} // Above-the-fold画像の場合
      />
      <h3>{product.name}</h3>
    </div>
  );
}
```

### Dynamic Imports

```typescript
// app/components/Chart.tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./ChartComponent"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // クライアントサイドでのみレンダリング
});

export default Chart;
```

### Streaming と Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from "react";

function SlowComponent() {
  // 重い処理
  return <div>Slow content</div>;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

## SEO とメタデータ

### Static Metadata

```typescript
// app/about/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and mission.",
  keywords: ["about", "company", "mission"],
  openGraph: {
    title: "About Us",
    description: "Learn more about our company and mission.",
    images: ["/images/about-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Learn more about our company and mission.",
    images: ["/images/about-twitter.jpg"],
  },
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

### Dynamic Metadata

```typescript
// app/posts/[slug]/page.tsx
import { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### Structured Data

```typescript
// app/components/StructuredData.tsx
interface ProductStructuredDataProps {
  product: {
    name: string;
    description: string;
    price: number;
    currency: string;
    availability: string;
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

## エラーハンドリング

### Error Boundaries

```typescript
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

// app/posts/error.tsx（特定のルート用）
("use client");

export default function PostsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Failed to load posts</h2>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
```

### Global Error Handling

```typescript
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

## セキュリティ

### Input Validation

```typescript
// lib/validations/post.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// app/api/posts/route.ts
import { createPostSchema } from '@/lib/validations/post';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // データベースに保存
    const post = await createPost(validatedData);

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function rateLimiter(
  request: NextRequest,
  limit: number = 5,
  windowMs: number = 60000
) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestLog = rateLimit.get(ip) || [];
  const requestsInWindow = requestLog.filter(
    (time: number) => time > windowStart
  );

  if (requestsInWindow.length >= limit) {
    return false;
  }

  requestsInWindow.push(now);
  rateLimit.set(ip, requestsInWindow);

  return true;
}

// app/api/posts/route.ts
export async function POST(request: NextRequest) {
  if (!rateLimiter(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // 処理続行
}
```

## テスト

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
  it("renders button with correct text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Route Testing

```typescript
// __tests__/api/posts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/posts/route';

describe('/api/posts', () => {
  it('returns posts', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
        }),
      ])
    );
  });
});
```

### E2E Testing (Playwright)

```typescript
// e2e/posts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Posts Page', () => {
  test('should display posts list', async ({ page }) => {
    await page.goto('/posts');

    await expect(page).toHaveTitle(/Posts/);
    await expect(page.locator('[data-testid="post-item"]')).toHaveCount(10);
  });

  test('should create new post', async ({ page }) => {
    await page.goto('/posts/new');

    await page.fill('[data-testid="title-input"]', 'Test Post');
    await page.fill('[data-testid="content-textarea"]', 'This is a test post');
    await page.click('[data-testid="submit-button"]');

    await expect(page).toHaveURL(/\/posts\//);
    await expect(page.locator('h1')).toContainText('Test Post');
  });
});
```

## 追加のベストプラクティス

### TypeScript 設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# .env.example（バージョン管理に含める）
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="generate-a-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Monitoring と Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
};

// app/api/posts/route.ts
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Creating new post');
    // 処理
    logger.info('Post created successfully', { postId: post.id });
    return NextResponse.json(post);
  } catch (error) {
    logger.error('Failed to create post', error as Error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

このガイドラインに従うことで、スケーラブルで保守性の高い Next.js App Router アプリケーションを構築できます。プロジェクトの規模や要件に応じて、必要な部分を選択して適用してください。
