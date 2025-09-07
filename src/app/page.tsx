'use client';

import { useState } from 'react';
import { MenuForm } from '@/features/menu/components/MenuForm';
import { MenuDisplay } from '@/features/menu/components/MenuDisplay';
import { useGenerateMenu } from '@/features/menu/hooks/useGenerateMenu';
import { Menu, MenuGenerationRequest } from '@/features/menu/types';

export default function HomePage() {
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [lastRequest, setLastRequest] = useState<MenuGenerationRequest | null>(
    null
  );

  const { generateMenu, isLoading, error } = useGenerateMenu();

  const handleGenerateMenu = async (request: MenuGenerationRequest) => {
    const menu = await generateMenu(request);
    if (menu) {
      setCurrentMenu(menu);
      setLastRequest(request);
    }
  };

  const handleRetry = async () => {
    if (lastRequest) {
      const menu = await generateMenu(lastRequest);
      if (menu) {
        setCurrentMenu(menu);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">🍱</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Kondate AI
          </h1>
          <p className="text-orange-700 text-lg font-medium">
            AI があなたの献立を提案します
          </p>
        </header>

        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-orange-800">献立を提案</h2>
            </div>
            <MenuForm onSubmit={handleGenerateMenu} isLoading={isLoading} />
            {error && (
              <div className="mt-6 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {currentMenu && (
            <MenuDisplay
              menu={currentMenu}
              onRetry={handleRetry}
              isRetrying={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
