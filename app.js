import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import redis from './src/redisClient.js';
import { appconfig } from './appconfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'production' ? false : {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
});

// Serve static files
fastify.register(await import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

// API routes
fastify.get('/api/questions/:lang', async (req, reply) => {
  const { lang } = req.params;
  const questionsString = await redis.get(`questions:${lang}`);
  
  if (!questionsString) {
    return reply.status(404).send({ error: 'Questions not found' });
  }

  // Parse the questions string into an array
  let questions;
  try {
    questions = JSON.parse(questionsString);
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to parse questions' });
  }

  // Randomize the questions if the configuration is set to true
  if (appconfig.randomise_questions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  // Encode the questions to Base64 after ensuring UTF-8 encoding
  const jsonString = JSON.stringify(questions);
   
  reply.send(jsonString);
});

fastify.get('/api/localisations/:lang', async (req, reply) => {
  const { lang } = req.params;
  const localisations = await redis.get(`localisations:${lang}`);
  if (!localisations) return reply.status(404).send({ error: 'Localisations not found' });
  reply.send(JSON.parse(localisations));
});

fastify.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : error.message;

  reply.status(statusCode).send({ error: message });
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000; // Default to 3000 for local development
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
    fastify.listen({ port, host });
    fastify.log.info(`Server running on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
