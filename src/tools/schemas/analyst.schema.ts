import { z } from 'zod';

export const analyzeDataSchema = z.object({
  data: z.string().describe('Raw data or text to analyze'),
  focus: z.string().optional().describe('Specific aspect to focus the analysis on'),
});

export const compareDataSchema = z.object({
  sources: z.array(z.string()).min(2).describe('List of data points or texts to compare'),
  criteria: z.string().optional().describe('Criteria to compare against'),
});

export const summarizeFindingsSchema = z.object({
  findings: z.array(z.string()).min(1).describe('List of findings to summarize'),
  format: z.enum(['bullet_points', 'paragraph', 'table']).default('bullet_points').describe('Output format for the summary'),
});
