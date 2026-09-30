import { createTool } from '@voltagent/core';
import { compareDataSchema } from './schemas/analyst.schema';

export const compareDataTool = createTool({
  name: 'compare_data',
  description: 'Compare multiple data sources or texts, highlighting similarities and differences',
  parameters: compareDataSchema,
  execute: async ({ sources, criteria }) => {
    const analyzed = sources.map((source, i) => {
      const words = new Set(source.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
      return { index: i, wordCount: source.split(/\s+/).length, uniqueWords: words };
    });

    const allWords = analyzed.flatMap((a) => [...a.uniqueWords]);
    const sharedWords = allWords.filter(
      (word) => analyzed.every((a) => a.uniqueWords.has(word))
    );

    return {
      sourceCount: sources.length,
      criteria: criteria ?? 'general comparison',
      comparison: analyzed.map((a) => ({
        sourceIndex: a.index,
        wordCount: a.wordCount,
        uniqueWordCount: a.uniqueWords.size,
      })),
      sharedTerms: [...new Set(sharedWords)].slice(0, 15),
      sharedTermCount: new Set(sharedWords).size,
    };
  },
});
