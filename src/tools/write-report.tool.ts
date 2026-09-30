import { createTool } from '@voltagent/core';
import { writeReportSchema } from './schemas/writer.schema';

export const writeReportTool = createTool({
  name: 'write_report',
  description: 'Generate a structured report from a title and sections',
  parameters: writeReportSchema,
  execute: async ({ title, sections, format }) => {
    let report: string;

    if (format === 'markdown') {
      const body = sections
        .map((s) => `## ${s.heading}\n\n${s.content}`)
        .join('\n\n');
      report = `# ${title}\n\n${body}`;
    } else {
      const divider = '='.repeat(40);
      const body = sections
        .map((s) => `${s.heading}\n${'-'.repeat(s.heading.length)}\n${s.content}`)
        .join(`\n\n${divider}\n\n`);
      report = `${title}\n${'='.repeat(title.length)}\n\n${body}`;
    }

    return {
      title,
      format,
      sectionCount: sections.length,
      wordCount: report.split(/\s+/).length,
      report,
    };
  },
});
