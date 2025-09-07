'use client';

import { useState } from 'react';
import { Menu } from '../types';
import { DishCard } from './DishCard';
import { ShoppingListModal } from './ShoppingListModal';

interface MenuDisplayProps {
  menu: Menu;
  onRetry: () => void;
  isRetrying: boolean;
}

export function MenuDisplay({ menu, onRetry, isRetrying }: MenuDisplayProps) {
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">🍱</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            今日の献立
          </h2>
          <p className="text-orange-600/80">
            AI が提案した栄養バランスの良い献立です
          </p>
        </div>

        <div className="space-y-6">
          <DishCard dish={menu.mainDish} title="主菜" icon="🍖" />
          <DishCard dish={menu.sideDish} title="副菜" icon="🥗" />
          <DishCard dish={menu.soup} title="汁物" icon="🍲" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                生成中...
              </>
            ) : (
              <>
                <span>🔄</span>
                他の献立を提案
              </>
            )}
          </button>

          <button
            onClick={() => setIsShoppingListOpen(true)}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          >
            <span>🛒</span>
            買い物リストを作成
          </button>
        </div>

        <ShoppingListModal
          menu={menu}
          isOpen={isShoppingListOpen}
          onClose={() => setIsShoppingListOpen(false)}
        />
      </div>
    </>
  );
}
