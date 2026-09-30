import { createTool } from '@voltagent/core';
import { summarizeFindingsSchema } from './schemas/analyst.schema';

export const summarizeFindingsTool = createTool({
  name: 'summarize_findings',
  description: 'Compile and structure a list of findings into a formatted summary',
  parameters: summarizeFindingsSchema,
  execute: async ({ findings, format }) => {
    let formatted: string;

    switch (format) {
      case 'bullet_points':
        formatted = findings.map((f) => `• ${f}`).join('\n');
        break;
      case 'paragraph':
        formatted = findings.join(' ');
        break;
      case 'table':
        formatted = [
          '| # | Finding |',
          '|---|---------|',
          ...findings.map((f, i) => `| ${i + 1} | ${f} |`),
        ].join('\n');
        break;
    }

    return {
      format,
      findingCount: findings.length,
      summary: formatted,
    };
  },
});
