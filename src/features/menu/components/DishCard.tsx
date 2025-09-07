"use client";

import { useState } from "react";
import { Dish } from "../types";

interface DishCardProps {
  dish: Dish;
  title: string;
  icon?: string;
}

export function DishCard({ dish, title, icon }: DishCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg">{icon}</span>
            </div>
          )}
          <h3 className="text-lg font-bold text-orange-800">{title}</h3>
        </div>
        <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
          {dish.name}
        </h4>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold text-sm rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span>{isExpanded ? "📝" : ""}</span>
          {isExpanded ? "詳細を閉じる" : "レシピを見る"}
          <svg
            className={`h-4 w-4 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-6 space-y-6 border-t border-orange-200/50 pt-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🥕</span>
                <h5 className="font-bold text-orange-800">材料</h5>
              </div>
              <ul className="space-y-2">
                {dish.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-orange-700 text-sm"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">👩‍🍳</span>
                <h5 className="font-bold text-orange-800">手順</h5>
              </div>
              <ol className="space-y-3">
                {dish.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-orange-700 text-sm"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
