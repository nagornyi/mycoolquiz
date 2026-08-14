import redis from './redisClient.js';
import { quizzes } from '../seed/quizzes/index.js';
import { globalUiConfig } from '../seed/globalUiConfig.js';

function isPlainObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

// Combines a quiz's own uiconfig with the shared defaults, so a quiz only
// needs to list what it wants to change (down to a single setting, like one
// score's emoji) and everything else keeps its default value.
function deepMerge(base, overrides) {
    const result = { ...base };
    for (const [key, value] of Object.entries(overrides || {})) {
        result[key] = isPlainObject(value) && isPlainObject(base[key])
            ? deepMerge(base[key], value)
            : value;
    }
    return result;
}

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
        // Combine this quiz's own settings with the shared defaults.
        const uiconfig = deepMerge(globalUiConfig, quiz.uiconfig);
        await redis.set(`quiz:${quizId}:uiconfig`, JSON.stringify(uiconfig));

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
