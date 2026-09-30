import 'dotenv/config';
import { VoltAgent, VoltAgentObservability, VoltOpsClient } from '@voltagent/core';
import { LibSQLObservabilityAdapter } from '@voltagent/libsql';
import { createPinoLogger } from '@voltagent/logger';
import { elysiaServer } from '@voltagent/server-elysia';
import { AnalystAgent, SearcherAgent, SupervisorAgent, WriterAgent } from './agents';

const logger = createPinoLogger({
  name: 'multi_agent',
  level: 'info',
});

const observability = new VoltAgentObservability({
  storage: new LibSQLObservabilityAdapter({
    url: 'file:./.voltagent/observability.db',
  }),
});

const { VOLTAGENT_PUBLIC_KEY, VOLTAGENT_SECRET_KEY } = process.env;

new VoltAgent({
  agents: {
    supervisor: SupervisorAgent,
    searcher: SearcherAgent,
    analyst: AnalystAgent,
    writer: WriterAgent,
  },
  server: elysiaServer(),
  logger,
  observability,
  voltOpsClient:
    VOLTAGENT_PUBLIC_KEY && VOLTAGENT_SECRET_KEY
      ? new VoltOpsClient({ publicKey: VOLTAGENT_PUBLIC_KEY, secretKey: VOLTAGENT_SECRET_KEY })
      : undefined,
});
