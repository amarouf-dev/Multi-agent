import { createTool } from '@voltagent/core';
import { webSearchSchema } from './schemas/researcher.schema';

export const webSearchTool = createTool({
  name: 'web_search',
  description: 'Search the web for information on a given query and return relevant results',
  parameters: webSearchSchema,
  execute: async ({ query, maxResults }) => {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`
    );
    const data = await response.json();

    const results: { title: string; url: string; snippet: string }[] = [];

    if (data.AbstractText) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || '',
        snippet: data.AbstractText,
      });
    }

    for (const topic of data.RelatedTopics?.slice(0, maxResults - results.length) ?? []) {
      if (topic.Text && topic.FirstURL) {
        results.push({
          title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 80),
          url: topic.FirstURL,
          snippet: topic.Text,
        });
      }
    }

    return {
      query,
      resultCount: results.length,
      results,
    };
  },
});
