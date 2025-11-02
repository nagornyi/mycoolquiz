import redis from './redisClient.js';
import { localisations } from '../seed/localisations.js';
import { questions } from '../seed/questions.js';

(async function seedQuizData() {
    await redis.set('questions:uk', JSON.stringify(questions.uk));
    await redis.set('questions:en', JSON.stringify(questions.en));
    await redis.set('localisations:uk', JSON.stringify(localisations.uk));
    await redis.set('localisations:en', JSON.stringify(localisations.en));

    console.log('Initial DB seeding completed');
    process.exit(0);
})();
