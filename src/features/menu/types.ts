export interface Dish {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export interface Menu {
  mainDish: Dish;
  sideDish: Dish;
  soup: Dish;
}

export interface MenuGenerationRequest {
  ingredients: string[];
  cuisine?: string;
  cookingTime?: string;
}

// 買い物リスト関連の型定義
export enum IngredientCategory {
  VEGETABLES = '野菜',
  MEAT_FISH = '肉・魚・卵',
  SEASONINGS = '調味料',
  DAIRY = '乳製品',
  GRAINS = '穀物',
  OTHERS = 'その他',
}

export interface IngredientInfo {
  name: string; // 正規化された食材名
  amount: string; // 分量
  unit: string; // 単位
  category: IngredientCategory;
}

export interface ShoppingListItem {
  id: string; // ユニークID
  ingredient: string; // 食材名（例: "玉ねぎ"）
  amount: string; // 必要分量（例: "1.5個"）
  originalAmounts: string[]; // 元の分量リスト（例: ["1個", "1/2個"]）
  category: IngredientCategory; // カテゴリ
  checked: boolean; // 買い物済みフラグ
  fromDishes: string[]; // どの料理で使用されるか（例: ["主菜", "副菜"]）
  unit: string; // 単位（例: "個", "g", "ml"）
  priority: number; // 表示順序
}

export interface ShoppingList {
  id: string;
  items: ShoppingListItem[];
  totalItems: number;
  checkedItems: number;
  createdAt: Date;
  menuSnapshot: Menu; // 生成時の献立情報
  userIngredients: string[]; // ユーザーが既に持っていた食材
}
