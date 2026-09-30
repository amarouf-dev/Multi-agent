import { createTool } from '@voltagent/core';
import { scrapeWebpageSchema } from './schemas/researcher.schema';

export const scrapeWebpageTool = createTool({
  name: 'scrape_webpage',
  description: 'Fetch and extract the text content from a webpage URL',
  parameters: scrapeWebpageSchema,
  execute: async ({ url }) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VoltAgent-Researcher/1.0',
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      return { url, success: false, error: `HTTP ${response.status}` };
    }

    const html = await response.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    return { url, success: true, content: text };
  },
});
