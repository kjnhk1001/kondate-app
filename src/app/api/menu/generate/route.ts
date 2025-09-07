import { NextRequest, NextResponse } from "next/server";
import { generateMenu } from "@/features/menu/lib/generateMenu";
import { MenuGenerationRequest } from "@/features/menu/types";

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body: MenuGenerationRequest = await request.json();

    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        { error: "食材を入力してください" },
        { status: 400 }
      );
    }

    const menu = await generateMenu(body);

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "献立の生成に失敗しました";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
