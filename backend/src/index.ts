import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { testConnection } from './config/database';
import { registerRoutes } from './api/routes';
import { startWorker } from './services/queueService';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

async function start() {
  try {
    await server.register(cors, {
      origin: true,
    });

    await server.register(rateLimit, {
      max: config.api.rateLimit,
      timeWindow: config.api.rateLimitWindow,
    });

    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    startWorker();

    await registerRoutes(server);

    await server.listen({ port: config.port, host: '0.0.0.0' });

    console.log(`\n🚀 Server running on http://localhost:${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`💾 Database: Connected`);
    console.log(`🔴 Redis: Connected\n`);

  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
