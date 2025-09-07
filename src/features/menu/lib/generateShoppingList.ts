import {
  Menu,
  IngredientInfo,
  IngredientCategory,
  ShoppingList,
  ShoppingListItem,
} from '../types';

// 食材名とカテゴリのマッピング（一般的な食材）
const INGREDIENT_CATEGORIES: Record<string, IngredientCategory> = {
  // 野菜
  玉ねぎ: IngredientCategory.VEGETABLES,
  にんじん: IngredientCategory.VEGETABLES,
  人参: IngredientCategory.VEGETABLES,
  じゃがいも: IngredientCategory.VEGETABLES,
  キャベツ: IngredientCategory.VEGETABLES,
  もやし: IngredientCategory.VEGETABLES,
  ピーマン: IngredientCategory.VEGETABLES,
  ねぎ: IngredientCategory.VEGETABLES,
  ほうれん草: IngredientCategory.VEGETABLES,
  大根: IngredientCategory.VEGETABLES,
  きのこ: IngredientCategory.VEGETABLES,
  しいたけ: IngredientCategory.VEGETABLES,
  えのき: IngredientCategory.VEGETABLES,
  わかめ: IngredientCategory.VEGETABLES,

  // 肉・魚・卵
  鶏肉: IngredientCategory.MEAT_FISH,
  鶏もも肉: IngredientCategory.MEAT_FISH,
  豚肉: IngredientCategory.MEAT_FISH,
  牛肉: IngredientCategory.MEAT_FISH,
  卵: IngredientCategory.MEAT_FISH,
  たまご: IngredientCategory.MEAT_FISH,
  豆腐: IngredientCategory.MEAT_FISH,
  絹ごし豆腐: IngredientCategory.MEAT_FISH,

  // 調味料
  しょうゆ: IngredientCategory.SEASONINGS,
  醤油: IngredientCategory.SEASONINGS,
  みりん: IngredientCategory.SEASONINGS,
  砂糖: IngredientCategory.SEASONINGS,
  塩: IngredientCategory.SEASONINGS,
  こしょう: IngredientCategory.SEASONINGS,
  サラダ油: IngredientCategory.SEASONINGS,
  ごま油: IngredientCategory.SEASONINGS,
  にんにく: IngredientCategory.SEASONINGS,
  生姜: IngredientCategory.SEASONINGS,
  味噌: IngredientCategory.SEASONINGS,
  酢: IngredientCategory.SEASONINGS,
  酒: IngredientCategory.SEASONINGS,
  オイスターソース: IngredientCategory.SEASONINGS,
  かつお節: IngredientCategory.SEASONINGS,
  だし汁: IngredientCategory.SEASONINGS,
  鶏ガラスープの素: IngredientCategory.SEASONINGS,

  // 乳製品
  牛乳: IngredientCategory.DAIRY,
  チーズ: IngredientCategory.DAIRY,
  バター: IngredientCategory.DAIRY,

  // 穀物
  米: IngredientCategory.GRAINS,
  パン: IngredientCategory.GRAINS,
  うどん: IngredientCategory.GRAINS,
  そば: IngredientCategory.GRAINS,
  パスタ: IngredientCategory.GRAINS,
};

/**
 * 献立から全食材を抽出する
 */
export function extractIngredientsFromMenu(
  menu: Menu
): Array<{ ingredient: string; dish: string }> {
  const ingredients: Array<{ ingredient: string; dish: string }> = [];

  // 主菜から抽出
  menu.mainDish.ingredients.forEach(ingredient => {
    ingredients.push({ ingredient, dish: '主菜' });
  });

  // 副菜から抽出
  menu.sideDish.ingredients.forEach(ingredient => {
    ingredients.push({ ingredient, dish: '副菜' });
  });

  // 汁物から抽出
  menu.soup.ingredients.forEach(ingredient => {
    ingredients.push({ ingredient, dish: '汁物' });
  });

  return ingredients;
}

/**
 * 食材文字列をパースして情報を抽出する
 * 例: "鶏もも肉（300g）" -> { name: "鶏もも肉", amount: "300g", unit: "g" }
 */
export function parseIngredient(ingredientText: string): IngredientInfo {
  // 分量を抽出（括弧内または最後の部分）
  const amountMatch = ingredientText.match(
    /[（(]([^）)]+)[）)]|(\d+[^\s）)]*)\s*$/
  );
  let amount = '';
  let name = ingredientText;

  if (amountMatch) {
    amount = amountMatch[1] || amountMatch[2] || '';
    name = ingredientText
      .replace(/[（(][^）)]+[）)]/, '')
      .replace(/\d+[^\s）)]*\s*$/, '')
      .trim();
  }

  // 単位を抽出
  const unitMatch = amount.match(/[^\d\s\/\.]+/);
  const unit = unitMatch ? unitMatch[0] : '';

  // カテゴリを決定
  const category = categorizeIngredient(name);

  return {
    name: name.trim(),
    amount: amount || '適量',
    unit: unit,
    category,
  };
}

/**
 * 食材をカテゴリ分類する
 */
export function categorizeIngredient(ingredient: string): IngredientCategory {
  // 完全一致を最初にチェック
  if (INGREDIENT_CATEGORIES[ingredient]) {
    return INGREDIENT_CATEGORIES[ingredient];
  }

  // 部分一致でチェック
  for (const [key, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (ingredient.includes(key) || key.includes(ingredient)) {
      return category;
    }
  }

  // パターンマッチング
  if (ingredient.match(/(肉|鶏|豚|牛|魚|卵|豆腐)/)) {
    return IngredientCategory.MEAT_FISH;
  }

  if (
    ingredient.match(/(しょうゆ|醤油|みりん|味噌|塩|油|酢|だし|ソース|スープ)/)
  ) {
    return IngredientCategory.SEASONINGS;
  }

  if (ingredient.match(/(牛乳|チーズ|バター|ヨーグルト)/)) {
    return IngredientCategory.DAIRY;
  }

  if (ingredient.match(/(米|パン|麺|うどん|そば)/)) {
    return IngredientCategory.GRAINS;
  }

  // デフォルトは野菜
  return IngredientCategory.VEGETABLES;
}

/**
 * 同一食材の分量を統合する
 */
export function consolidateIngredients(
  ingredients: Array<{ info: IngredientInfo; dish: string }>
): ShoppingListItem[] {
  const consolidatedMap = new Map<string, ShoppingListItem>();

  ingredients.forEach(({ info, dish }, index) => {
    const key = info.name;

    if (consolidatedMap.has(key)) {
      // 既存の食材に統合
      const existing = consolidatedMap.get(key)!;
      existing.originalAmounts.push(info.amount);
      if (!existing.fromDishes.includes(dish)) {
        existing.fromDishes.push(dish);
      }
      // 分量の統合は簡易実装（実際には単位変換が必要）
      existing.amount = consolidateAmounts(existing.originalAmounts);
    } else {
      // 新しい食材として追加
      consolidatedMap.set(key, {
        id: `ingredient-${index}-${Date.now()}`,
        ingredient: info.name,
        amount: info.amount,
        originalAmounts: [info.amount],
        category: info.category,
        checked: false,
        fromDishes: [dish],
        unit: info.unit,
        priority: getCategoryPriority(info.category),
      });
    }
  });

  return Array.from(consolidatedMap.values()).sort(
    (a, b) => a.priority - b.priority
  );
}

/**
 * 分量を統合する（簡易実装）
 */
function consolidateAmounts(amounts: string[]): string {
  // 「適量」「少々」などの場合はそのまま
  if (amounts.some(amount => amount.match(/(適量|少々|お好み)/))) {
    return '適量';
  }

  // 数値の場合は合算を試みる
  const numericAmounts = amounts.map(amount => {
    const match = amount.match(/[\d\.\/]+/);
    return match ? parseFloat(match[0]) : 0;
  });

  if (numericAmounts.every(num => num > 0)) {
    const total = numericAmounts.reduce((sum, num) => sum + num, 0);
    const unit = amounts[0].replace(/[\d\.\/]+\s*/, '');
    return `${total}${unit}`;
  }

  // 統合できない場合は最初のものを返す
  return amounts[0];
}

/**
 * カテゴリの表示優先度を取得
 */
function getCategoryPriority(category: IngredientCategory): number {
  const priorities = {
    [IngredientCategory.VEGETABLES]: 1,
    [IngredientCategory.MEAT_FISH]: 2,
    [IngredientCategory.DAIRY]: 3,
    [IngredientCategory.GRAINS]: 4,
    [IngredientCategory.SEASONINGS]: 5,
    [IngredientCategory.OTHERS]: 6,
  };
  return priorities[category] || 6;
}

/**
 * 買い物リストを生成する
 */
export function generateShoppingList(
  menu: Menu,
  ownedIngredients: string[]
): ShoppingList {
  // 1. 献立から全食材を抽出
  const extractedIngredients = extractIngredientsFromMenu(menu);

  // 2. 各食材をパースして詳細情報を取得
  const parsedIngredients = extractedIngredients.map(
    ({ ingredient, dish }) => ({
      info: parseIngredient(ingredient),
      dish,
    })
  );

  // 3. 同一食材を統合
  const consolidatedIngredients = consolidateIngredients(parsedIngredients);

  // 4. 既に持っている食材を除外
  const neededIngredients = consolidatedIngredients.filter(
    item =>
      !ownedIngredients.some(
        owned =>
          item.ingredient.includes(owned) || owned.includes(item.ingredient)
      )
  );

  // 5. 買い物リストを生成
  return {
    id: `shopping-list-${Date.now()}`,
    items: neededIngredients,
    totalItems: neededIngredients.length,
    checkedItems: 0,
    createdAt: new Date(),
    menuSnapshot: menu,
    userIngredients: ownedIngredients,
  };
}

/**
 * 買い物リストをテキスト形式でフォーマット
 */
export function formatShoppingListText(shoppingList: ShoppingList): string {
  const categoryGroups = shoppingList.items.reduce(
    (groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    },
    {} as Record<IngredientCategory, ShoppingListItem[]>
  );

  let text = '買い物リスト\n' + '━'.repeat(20) + '\n\n';

  // カテゴリごとに出力
  Object.entries(categoryGroups).forEach(([category, items]) => {
    const icon = getCategoryIcon(category as IngredientCategory);
    text += `${icon} ${category}\n`;
    items.forEach(item => {
      text += `□ ${item.ingredient}（${item.amount}）\n`;
    });
    text += '\n';
  });

  return text;
}

/**
 * カテゴリアイコンを取得
 */
function getCategoryIcon(category: IngredientCategory): string {
  const icons = {
    [IngredientCategory.VEGETABLES]: '🥬',
    [IngredientCategory.MEAT_FISH]: '🍖',
    [IngredientCategory.SEASONINGS]: '🧂',
    [IngredientCategory.DAIRY]: '🥛',
    [IngredientCategory.GRAINS]: '🌾',
    [IngredientCategory.OTHERS]: '📦',
  };
  return icons[category] || '📦';
}
