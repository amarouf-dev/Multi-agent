import { z } from 'zod';

export const webSearchSchema = z.object({
  query: z.string().describe('The search query to look up'),
  maxResults: z.number().min(1).max(10).default(5).describe('Maximum number of results to return'),
});

export const scrapeWebpageSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to scrape'),
});
