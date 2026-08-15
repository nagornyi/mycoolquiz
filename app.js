import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import redis from './src/redisClient.js';
import { appconfig } from './appconfig.js';
import { shuffle } from './shared/shuffle.js';

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

// Serve static files. Cache them for a while so repeat visits don't need to
// round-trip to the server just to revalidate an unchanged bundle/stylesheet
// — meaningful on a CPU-constrained instance where every request counts.
fastify.register(await import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
  maxAge: '1h',
});

fastify.get('/', async (request, reply) => {
  // Load the active quiz's metadata just to fail fast (with a clear error)
  // if it hasn't been seeded yet. The Preact app fetches the same data via
  // /api/meta once it mounts.
  const metaString = await redis.get(`quiz:${appconfig.active_quiz}:meta`);
  if (!metaString) {
    return reply.status(500).send({ error: `Quiz "${appconfig.active_quiz}" has not been seeded. Run the seed script first.` });
  }
  const quizMeta = JSON.parse(metaString);

  reply.type('text/html').send(`
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${quizMeta.title}</title>
      <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="/public/css/main.css">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
      <div id="app-root"></div>
      <script src="/public/dist/main.js" type="module"></script>
  </body>
  </html>
  `);
});

// API routes
fastify.get('/api/meta', async (request, reply) => {
  const metaString = await redis.get(`quiz:${appconfig.active_quiz}:meta`);
  if (!metaString) return reply.status(404).send({ error: 'Quiz metadata not found' });
  reply.send(JSON.parse(metaString));
});

fastify.get('/api/questions/:lang', async (req, reply) => {
  const { lang } = req.params;
  const questionsString = await redis.get(`quiz:${appconfig.active_quiz}:questions:${lang}`);
  
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

  // Randomize the questions if the active quiz's configuration is set to true
  const uiconfigString = await redis.get(`quiz:${appconfig.active_quiz}:uiconfig`);
  const quizUiconfig = uiconfigString ? JSON.parse(uiconfigString) : {};
  if (quizUiconfig.randomise_questions) {
    questions = shuffle(questions);
  }

  reply.send(JSON.stringify(questions));
});

fastify.get('/api/localisations/:lang', async (req, reply) => {
  const { lang } = req.params;
  const localisations = await redis.get(`quiz:${appconfig.active_quiz}:localisations:${lang}`);
  if (!localisations) return reply.status(404).send({ error: 'Localisations not found' });
  reply.send(JSON.parse(localisations));
});

fastify.get('/api/uiconfig', async (req, reply) => {
  const uiconfig = await redis.get(`quiz:${appconfig.active_quiz}:uiconfig`);
  if (!uiconfig) return reply.status(404).send({ error: 'UI config not found' });
  reply.send(JSON.parse(uiconfig));
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
