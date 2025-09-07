import { openai } from '@/libs/openai';
import { Menu, MenuGenerationRequest } from '../types';

const MENU_GENERATION_PROMPT = `
あなたは料理の専門家です。与えられた条件に基づいて、1食分の献立（主菜・副菜・汁物）を提案してください。

条件：
- 食材: {ingredients}
- ジャンル: {cuisine}
- 調理時間: {cookingTime}

以下のJSON形式で回答してください：
{
  "mainDish": {
    "name": "料理名",
    "ingredients": ["材料1（分量）", "材料2（分量）", "..."],
    "instructions": ["手順1", "手順2", "..."]
  },
  "sideDish": {
    "name": "料理名", 
    "ingredients": ["材料1（分量）", "材料2（分量）", "..."],
    "instructions": ["手順1", "手順2", "..."]
  },
  "soup": {
    "name": "料理名",
    "ingredients": ["材料1（分量）", "材料2（分量）", "..."],
    "instructions": ["手順1", "手順2", "..."]
  }
}

注意点：
- 栄養バランスを考慮してください
- 指定された調理時間内で作れる献立にしてください
- 与えられた食材は主菜・副菜・汁物のどれかで使用してください
- 主菜・副菜・汁物は同じ食材ばかりに偏らず、複数の食材を追加してバランスよく組み合わせてください
- 材料には分量を含めてください
`;

export async function generateMenu(
  request: MenuGenerationRequest
): Promise<Menu> {
  try {
    // Check if API key is still the placeholder
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === 'your_openai_api_key_here'
    ) {
      throw new Error(
        'OpenAI APIキーが設定されていません。.env.localファイルに正しいAPIキーを設定してください。'
      );
    }

    const prompt = MENU_GENERATION_PROMPT.replace(
      '{ingredients}',
      request.ingredients.join(', ')
    )
      .replace('{cuisine}', request.cuisine || 'なし')
      .replace('{cookingTime}', request.cookingTime || '30分');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'あなたは日本料理の専門家です。献立を提案し、必ず有効なJSONのみを回答してください。説明文は不要です。JSONのみを出力してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('OpenAI APIからの応答が不正です');
    }

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI APIから空の応答が返されました');
    }

    // Clean up the content to extract JSON
    let cleanedContent = content.trim();

    // Remove markdown code blocks if present
    if (cleanedContent.includes('```json')) {
      const jsonMatch = cleanedContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[1].trim();
      }
    } else if (cleanedContent.includes('```')) {
      const codeMatch = cleanedContent.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        cleanedContent = codeMatch[1].trim();
      }
    }

    // Find JSON object boundaries
    const jsonStart = cleanedContent.indexOf('{');
    const jsonEnd = cleanedContent.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      console.error('No valid JSON found in response:', content);
      throw new Error('AIの応答にJSONが含まれていません');
    }

    const jsonString = cleanedContent.substring(jsonStart, jsonEnd + 1);

    let parsedMenu;
    try {
      parsedMenu = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      console.error('Cleaned content:', cleanedContent);
      console.error('Extracted JSON:', jsonString);
      throw new Error('AIからの応答を解析できませんでした');
    }

    if (!parsedMenu.mainDish || !parsedMenu.sideDish || !parsedMenu.soup) {
      throw new Error(
        '献立の構成が不正です（主菜・副菜・汁物のいずれかが不足）'
      );
    }

    return {
      mainDish: parsedMenu.mainDish,
      sideDish: parsedMenu.sideDish,
      soup: parsedMenu.soup,
    };
  } catch (error) {
    console.error('Error generating menu:', error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error(
          'OpenAI APIキーが無効です。正しいAPIキーを設定してください。'
        );
      }

      if (error.message.includes('insufficient_quota')) {
        throw new Error(
          'OpenAI APIの利用制限に達しました。アカウントの残高を確認してください。'
        );
      }

      if (error.message.includes('rate_limit')) {
        throw new Error(
          'APIの利用制限に達しました。しばらく待ってから再試行してください。'
        );
      }

      // Re-throw our custom error messages
      throw error;
    }

    throw new Error('献立の生成中に予期しないエラーが発生しました');
  }
}
