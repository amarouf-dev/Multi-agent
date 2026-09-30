import { createTool } from '@voltagent/core';
import { formatSectionSchema } from './schemas/writer.schema';

export const formatSectionTool = createTool({
  name: 'format_section',
  description: 'Reformat raw content into a specific writing style (executive summary, detailed, or technical)',
  parameters: formatSectionSchema,
  execute: async ({ content, style }) => {
    const wordCount = content.split(/\s+/).length;

    const styleGuide = {
      executive_summary: 'Concise, high-level overview for decision makers. Focus on key takeaways and recommendations.',
      detailed: 'Comprehensive coverage with supporting evidence and context. Include examples and elaboration.',
      technical: 'Precise, data-driven language. Include metrics, specifications, and technical details.',
    };

    return {
      style,
      styleGuide: styleGuide[style],
      originalWordCount: wordCount,
      content,
    };
  },
});
