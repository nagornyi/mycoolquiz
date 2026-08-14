export const appconfig = {
    // Id of the quiz currently served by the app. Must match the `id` of one
    // of the quiz files under seed/quizzes/, and that quiz's data must have
    // been seeded into Redis (see src/seedQuizData.js).
    // Override via the ACTIVE_QUIZ environment variable, e.g.:
    //   ACTIVE_QUIZ=literary-evening npm run start:dev
    // so switching quizzes doesn't require editing a tracked file.
    active_quiz: process.env.ACTIVE_QUIZ || "poetry-quiz"
};
