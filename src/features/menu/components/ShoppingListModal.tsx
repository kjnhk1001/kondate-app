'use client';

import { useState } from 'react';
import { Menu, ShoppingList, IngredientCategory } from '../types';
import { generateShoppingList, extractIngredientsFromMenu, parseIngredient, formatShoppingListText } from '../lib/generateShoppingList';

interface ShoppingListModalProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingListModal({ menu, isOpen, onClose }: ShoppingListModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [ownedIngredients, setOwnedIngredients] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

  // 献立から全食材を抽出
  const allIngredients = extractIngredientsFromMenu(menu).map(item => 
    parseIngredient(item.ingredient).name
  );
  
  // 重複を除去
  const uniqueIngredients = Array.from(new Set(allIngredients));

  const handleIngredientToggle = (ingredient: string) => {
    setOwnedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleCreateShoppingList = () => {
    const list = generateShoppingList(menu, ownedIngredients);
    setShoppingList(list);
    setStep(2);
  };

  const handleItemCheck = (itemId: string) => {
    if (!shoppingList) return;
    
    const updatedItems = shoppingList.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    
    setShoppingList({
      ...shoppingList,
      items: updatedItems,
      checkedItems: updatedItems.filter(item => item.checked).length
    });
  };

  const handleCopyList = async () => {
    if (!shoppingList) return;
    
    try {
      const text = formatShoppingListText(shoppingList);
      await navigator.clipboard.writeText(text);
      alert('買い物リストをクリップボードにコピーしました！');
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      alert('コピーに失敗しました。ブラウザが対応していない可能性があります。');
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReset = () => {
    setStep(1);
    setOwnedIngredients([]);
    setShoppingList(null);
  };

  const getCategoryIcon = (category: IngredientCategory): string => {
    const icons = {
      [IngredientCategory.VEGETABLES]: '🥬',
      [IngredientCategory.MEAT_FISH]: '🍖',
      [IngredientCategory.SEASONINGS]: '🧂',
      [IngredientCategory.DAIRY]: '🥛',
      [IngredientCategory.GRAINS]: '🌾',
      [IngredientCategory.OTHERS]: '📦',
    };
    return icons[category] || '📦';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-orange-100/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h2 className="text-2xl font-bold">買い物リスト作成</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-orange-50 px-6 py-3 border-b">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step === 1 ? 'bg-orange-600 text-white' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span>所有食材選択</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                step === 2 ? 'bg-orange-600 text-white' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span>買い物リスト</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  既にお持ちの食材を選択してください
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  選択された食材は買い物リストから除外されます
                </p>
              </div>

              <div className="space-y-2">
                {uniqueIngredients.map((ingredient, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={ownedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {ingredient}
                    </span>
                  </label>
                ))}
              </div>

              {ownedIngredients.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">
                    選択済み ({ownedIngredients.length}個):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ownedIngredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {shoppingList && shoppingList.items.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      買い物リスト ({shoppingList.totalItems}個の食材)
                    </h3>
                    <div className="text-sm text-gray-600">
                      完了: {shoppingList.checkedItems} / {shoppingList.totalItems}
                    </div>
                  </div>

                  {/* Category Groups */}
                  {Object.values(IngredientCategory).map(category => {
                    const categoryItems = shoppingList.items.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(category)}</span>
                            {category} ({categoryItems.length})
                          </h4>
                        </div>
                        <div className="p-4 space-y-3">
                          {categoryItems.map(item => (
                            <label
                              key={item.id}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleItemCheck(item.id)}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                              />
                              <div className="flex-1">
                                <span className={`font-medium ${
                                  item.checked ? 'text-gray-500 line-through' : 'text-gray-800'
                                }`}>
                                  {item.ingredient}
                                </span>
                                <span className={`ml-2 ${
                                  item.checked ? 'text-gray-400 line-through' : 'text-gray-600'
                                }`}>
                                  ({item.amount})
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                  使用料理: {item.fromDishes.join(', ')}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl">🎉</span>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                    すべての食材をお持ちです！
                  </h3>
                  <p className="text-gray-600">
                    追加で購入する食材はありません。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← 戻る
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step === 1 ? (
                <button
                  onClick={handleCreateShoppingList}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span>📝</span>
                  買い物リストを作成
                </button>
              ) : (
                <>
                  {shoppingList && shoppingList.items.length > 0 && (
                    <button
                      onClick={handleCopyList}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <span>📋</span>
                      コピー
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    最初から
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}