'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MenuGenerationRequest } from '../types';

interface MenuFormProps {
  onSubmit: (request: MenuGenerationRequest) => void;
  isLoading: boolean;
}

interface FormData {
  newIngredient: string;
  cuisine: string;
  cookingTime: string;
}

const CUISINE_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '和食', label: '和食' },
  { value: '洋食', label: '洋食' },
  { value: '中華', label: '中華' },
];

const COOKING_TIME_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '15分', label: '15分' },
  { value: '30分', label: '30分' },
  { value: '1時間', label: '1時間' },
];

export function MenuForm({ onSubmit, isLoading }: MenuFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const newIngredient = watch('newIngredient');

  const addIngredient = () => {
    const ingredient = newIngredient?.trim();
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      reset({ newIngredient: '' });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: FormData) => {
    if (ingredients.length === 0) {
      alert('食材を1つ以上追加してください');
      return;
    }

    onSubmit({
      ingredients,
      cuisine: data.cuisine || undefined,
      cookingTime: data.cookingTime || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div>
        <label
          htmlFor="newIngredient"
          className="block text-sm font-semibold text-orange-800 mb-2"
        >
          <span className="flex items-center gap-2">
            <span>🥕</span>
            食材を追加 *
          </span>
        </label>
        <div className="flex gap-3">
          <input
            id="newIngredient"
            type="text"
            {...register('newIngredient')}
            placeholder="例: 鶏肉"
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-xl border-2 border-orange-200 bg-white/70 px-4 py-3 shadow-sm transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addIngredient}
            disabled={isLoading || !newIngredient?.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
          >
            <span>➕</span>
          </button>
        </div>
        <p className="mt-2 text-sm text-orange-600/80">
          1つずつ食材を入力して追加ボタンを押してください（Enterキーでも追加可能）
        </p>

        {/* 追加された食材の表示 */}
        {ingredients.length > 0 && (
          <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-orange-100">
            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <span>📝</span>
              追加された食材 ({ingredients.length}個)
            </h4>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-lg border border-orange-200"
                >
                  <span className="text-sm font-medium">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 transition-colors ml-1"
                    disabled={isLoading}
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="cuisine"
            className="block text-sm font-semibold text-orange-800 mb-2"
          >
            <span className="flex items-center gap-2">
              <span>🍜</span>
              ジャンル
            </span>
          </label>
          <select
            id="cuisine"
            {...register('cuisine')}
            className="mt-1 block w-full rounded-xl border-2 border-orange-200 bg-white/70 px-4 py-3 shadow-sm transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none backdrop-blur-sm"
            disabled={isLoading}
          >
            {CUISINE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="cookingTime"
            className="block text-sm font-semibold text-orange-800 mb-2"
          >
            <span className="flex items-center gap-2">
              <span>⏰</span>
              調理時間
            </span>
          </label>
          <select
            id="cookingTime"
            {...register('cookingTime')}
            className="mt-1 block w-full rounded-xl border-2 border-orange-200 bg-white/70 px-4 py-3 shadow-sm transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none backdrop-blur-sm"
            disabled={isLoading}
          >
            {COOKING_TIME_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 border-0 rounded-2xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              献立を生成中...
            </>
          ) : (
            <>
              <span>✨</span>
              献立を提案する
            </>
          )}
        </button>
      </div>
    </form>
  );
}
