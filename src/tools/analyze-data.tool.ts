import { createTool } from '@voltagent/core';
import { analyzeDataSchema } from './schemas/analyst.schema';

export const analyzeDataTool = createTool({
  name: 'analyze_data',
  description: 'Analyze raw data or text, extracting key insights, patterns, and statistics',
  parameters: analyzeDataSchema,
  execute: async ({ data, focus }) => {
    const wordCount = data.split(/\s+/).length;
    const sentences = data.split(/[.!?]+/).filter(Boolean);
    const uniqueWords = new Set(data.toLowerCase().split(/\s+/));

    const keywords = [...uniqueWords]
      .filter((w) => w.length > 4)
      .sort((a, b) => {
        const countA = data.toLowerCase().split(a).length - 1;
        const countB = data.toLowerCase().split(b).length - 1;
        return countB - countA;
      })
      .slice(0, 10);

    return {
      stats: {
        wordCount,
        sentenceCount: sentences.length,
        uniqueWordCount: uniqueWords.size,
        avgWordsPerSentence: Math.round(wordCount / sentences.length),
      },
      topKeywords: keywords,
      focus: focus ?? 'general',
      dataPreview: data.slice(0, 200),
    };
  },
});
