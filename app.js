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
  prefix: '/public/'
});

fastify.get('/', async (request, reply) => {
  // Generate language selection buttons dynamically
  const languageButtons = appconfig.quiz_languages
    .map(lang => `<button class="lang-btn" data-lang="${lang.code}">${lang.name}</button>`)
    .join("\n");

  reply.type('text/html').send(`
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${appconfig.quiz_title}</title>
      <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="/public/css/main.css">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
      <div class="app" id="app">
          <h1 id="quiz-name">${appconfig.quiz_title}</h1>
          <div id="language-selection" style="display: none;">
            ${languageButtons}
          </div>
          <button id="start-quiz-btn" style="display: none;"></button>
          <div class="quiz">
              <div id="quiz-info" class="framed-text" style="display: none;"></div>
              <h2 id="question" style="display: none;"></h2>
              <div id="answer-buttons"></div>
              <div class="button-container">
                  <button id="next-btn" style="display: none;"></button>
              </div>
          </div>
          <canvas id="fireworks"></canvas>
      </div>
      <script src="/public/js/quiz.js" type="module"></script>
  </body>
  </html>
  `);
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
