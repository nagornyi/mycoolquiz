import redis from './redisClient.js';
import { quizzes } from '../seed/quizzes/index.js';

// Usage:
//   npm run seed                 -> seeds every registered quiz
//   node src/seedQuizData.js foo -> seeds only the quiz with id "foo"
const requestedQuizId = process.argv[2];
const quizIdsToSeed = requestedQuizId ? [requestedQuizId] : Object.keys(quizzes);

(async function seedQuizData() {
    for (const quizId of quizIdsToSeed) {
        const quiz = quizzes[quizId];

        if (!quiz) {
            console.error(`Unknown quiz "${quizId}". Available quizzes: ${Object.keys(quizzes).join(', ')}`);
            process.exitCode = 1;
            continue;
        }

        await redis.set(`quiz:${quizId}:meta`, JSON.stringify({ title: quiz.title, languages: quiz.languages }));
        await redis.set(`quiz:${quizId}:uiconfig`, JSON.stringify(quiz.uiconfig));

        for (const lang of Object.keys(quiz.questions)) {
            await redis.set(`quiz:${quizId}:questions:${lang}`, JSON.stringify(quiz.questions[lang]));
        }
        for (const lang of Object.keys(quiz.localisations)) {
            await redis.set(`quiz:${quizId}:localisations:${lang}`, JSON.stringify(quiz.localisations[lang]));
        }

        console.log(`Seeded quiz "${quizId}"`);
    }

    console.log('DB seeding completed');
    process.exit(0);
})();
