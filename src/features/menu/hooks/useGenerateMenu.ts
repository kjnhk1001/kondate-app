'use client';

import { useState } from 'react';
import { Menu, MenuGenerationRequest } from '../types';

export function useGenerateMenu() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMenu = async (
    request: MenuGenerationRequest
  ): Promise<Menu | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/menu/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '献立の生成に失敗しました');
      }

      const menu: Menu = await response.json();
      return menu;
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateMenu,
    isLoading,
    error,
  };
}
