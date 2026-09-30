# multi_agent

A multi-agent research system built with [VoltAgent](https://voltagent.dev). You give a supervisor agent a topic. It hands the work to three specialist sub-agents (a researcher, an analyst and a writer) and returns a finished report.

This is a learning project for three things: VoltAgent, multi-agent systems and the supervisor pattern.

## How it works

```
                    User request
                         │
                         ▼
                 ┌───────────────┐
                 │  supervisor   │  plans the work and delegates it;
                 └───────┬───────┘  never researches or writes itself
                         │ delegate_task
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 ┌────────────┐   ┌────────────┐   ┌────────────┐
 │  searcher  │ → │  analyst   │ → │   writer   │
 └────────────┘   └────────────┘   └────────────┘
  web_search       analyze_data      format_section
  scrape_webpage   compare_data      write_report
                   summarize_findings
```

1. The **supervisor** turns the request into a research brief.
2. The **searcher** searches the web, reads the most relevant pages and returns findings with their sources.
3. The **analyst** measures and compares those findings and turns them into structured insights.
4. The **writer** turns the insights into a markdown report.
5. The supervisor returns the report to the user.

### VoltAgent's built-in multi-agent support

No orchestration code is written by hand. The supervisor is an ordinary `Agent` configured with two options:

```ts
new Agent({
  name: 'supervisor',
  instructions: '...pipeline: research -> analysis -> writing...',
  subAgents: [SearcherAgent, AnalystAgent, WriterAgent],
  supervisorConfig: {
    customGuidelines: ['Always follow the pipeline order...'],
  },
});
```

- **`subAgents`**: VoltAgent gives the supervisor a built-in `delegate_task` tool that takes `task`, `targetAgents` and optional `context`. When the supervisor's model calls it, VoltAgent runs the named sub-agents and returns their output to the supervisor.
- **`supervisorConfig`**: VoltAgent writes a system prompt describing the available sub-agents. `customGuidelines` adds extra rules to that prompt.

The order of the pipeline comes from the supervisor's `instructions` and `customGuidelines`. The order of the `subAgents` array has no effect.

## Agents and tools

| Agent | Role | Tools |
|---|---|---|
| `supervisor` | Coordinates the pipeline and checks the quality of each stage | `delegate_task` (added by VoltAgent) |
| `searcher` | Gathers information from the web | `web_search`, `scrape_webpage` |
| `analyst` | Extracts statistics, compares sources and summarizes findings | `analyze_data`, `compare_data`, `summarize_findings` |
| `writer` | Produces the final report | `format_section`, `write_report` |

About the tools:

- `web_search` uses the free DuckDuckGo Instant Answer API. It needs no API key, but it returns short summary answers rather than full search results.
- `scrape_webpage` removes the HTML from a page and returns the first 5,000 characters of text.
- The analyst and writer tools are plain TypeScript and do not call a model. They count and format text, and the agent's model does the reasoning.

## Project structure

```
src/
├── index.ts                     # Entry point: registers agents with the VoltAgent server
├── agents/
│   ├── index.ts
│   ├── supervisor-agent.ts
│   ├── researcher-agent.ts      # exports SearcherAgent
│   ├── analyst-agnet.ts
│   └── writer-agent.ts
└── tools/
    ├── index.ts
    ├── schemas/                 # Zod input schemas, one file per agent
    │   ├── researcher.schema.ts
    │   ├── analyst.schema.ts
    │   └── writer.schema.ts
    ├── web-search.tool.ts
    ├── scrape-webpage.tool.ts
    ├── analyze-data.tool.ts
    ├── compare-data.tool.ts
    ├── summarize-findings.tool.ts
    ├── format-section.tool.ts
    └── write-report.tool.ts
```

## Getting started

### Prerequisites

- Node.js 20.19 or later
- A Google AI API key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Install

```bash
npm install
```

### Configure

Create a `.env` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here

# Optional: VoltOps tracing (https://console.voltagent.dev/tracing-setup)
# VOLTAGENT_PUBLIC_KEY=
# VOLTAGENT_SECRET_KEY=
```

All agents use `google/gemini-3.5-flash`. To use a different model, change the `model` field in each file in `src/agents/`.

### Run

```bash
npm run dev        # development server with hot reload on http://localhost:3141
```

For production:

```bash
npm run build
npm start
```

## Usage

### From the VoltOps console

1. Start the server with `npm run dev`.
2. Open [console.voltagent.dev](https://console.voltagent.dev). It connects to `http://localhost:3141` automatically.
3. Select the **supervisor** agent and send a request, for example:

   > Research the current state of solid-state batteries for electric vehicles and write a report.

The console shows each `delegate_task` call, each sub-agent run and each tool call as they happen. This is the easiest way to see the supervisor pattern at work.

### Over HTTP

```bash
curl -X POST http://localhost:3141/agents/supervisor/text \
  -H "Content-Type: application/json" \
  -d '{"input": "Research the current state of solid-state batteries for EVs and write a report."}'
```

Use `/agents/supervisor/stream` instead to stream the response.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the app into `dist/` |
| `npm start` | Runs the built app |
| `npm run typecheck` | Checks the TypeScript types |
| `npm run lint` | Runs Biome |

## Docker

```bash
docker build -t multi_agent .
docker run -p 3141:3141 --env-file .env multi_agent
```

## Resources

- [VoltAgent documentation](https://voltagent.dev/docs/)
- [VoltAgent examples](https://github.com/VoltAgent/voltagent/tree/main/examples)
