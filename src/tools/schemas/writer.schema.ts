import { z } from 'zod';

export const writeReportSchema = z.object({
  title: z.string().describe('Title of the report'),
  sections: z.array(z.object({
    heading: z.string().describe('Section heading'),
    content: z.string().describe('Section content'),
  })).min(1).describe('Report sections'),
  format: z.enum(['markdown', 'plain_text']).default('markdown').describe('Output format'),
});

export const formatSectionSchema = z.object({
  content: z.string().describe('Raw content to format'),
  style: z.enum(['executive_summary', 'detailed', 'technical']).describe('Writing style for the section'),
});
