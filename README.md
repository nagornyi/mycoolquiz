# My Cool Quiz

A simple quiz application that is implemented using the Fastify web framework. The app can host multiple quizzes, each with its own questions, localisations, and result-screen styling — but only one quiz is served (active) at a time. Each quiz can be localised into multiple languages.

## Quizzes bundled with this app

- `poetry-quiz` — a classic English/Ukrainian poetry quiz.
- `literary-evening` — a Ukrainian/Japanese literature quiz about writers and poets.

Every quiz lives in its own file under `seed/quizzes/`, and all quizzes are registered in `seed/quizzes/index.js`.

## Choosing which quiz is served

Set the `ACTIVE_QUIZ` environment variable to the id of the quiz you want to serve, e.g.:

```sh
ACTIVE_QUIZ=literary-evening npm run start:dev
```

If `ACTIVE_QUIZ` isn't set, the app falls back to the default defined in `appconfig.js`:

```js
export const appconfig = {
    active_quiz: process.env.ACTIVE_QUIZ || "poetry-quiz"
};
```

Using the environment variable means you can switch quizzes without editing a tracked file. Make sure that quiz's data has been seeded into Redis (see below), then (re)start the app.

## Seeding quiz data

Each quiz's questions, localisations, and UI/result-screen config are defined in its `seed/quizzes/<quizId>.js` file and get loaded into Redis by `src/seedQuizData.js`.

```sh
npm run seed                   # seeds every registered quiz
npm run seed:poetry            # seeds only the "poetry-quiz" quiz
npm run seed:literary-evening  # seeds only the "literary-evening" quiz
node src/seedQuizData.js <id>  # seeds only the quiz with the given id
```

Re-run the relevant seed command whenever you change a quiz's content, then restart the app (or just refresh the page, since content is read from Redis on each request).

## Add or customise a quiz

Create a new file in `seed/quizzes/`, e.g. `seed/quizzes/myQuiz.js`, exporting an object with this shape:

```js
export default {
  id: "my-quiz",
  title: "My Quiz",
  languages: [
    { code: "en", name: "English" },
    { code: "uk", name: "Українська" }
  ],
  questions: {
    en: [ /* ...questions for this language... */ ],
    uk: [ /* ... */ ]
  },
  localisations: {
    en: { quiz_name, quiz_description, maxscore, highscore, avgscore, lowscore },
    uk: { /* ... */ }
  },
  uiconfig: {
    en: { quiz_start_btn, next_question_btn, quiz_restart_btn, number_of_questions, quiz_description, final_result },
    uk: { /* ... */ },
    randomise_answers: true,
    randomise_questions: true,
    highlight_correct_answer: true,
    fireworks_on_result_screen: true,
    maxscore: { color, bordercolor, emoji },
    highscore: { color, bordercolor, emoji },
    avgscore: { color, bordercolor, emoji },
    lowscore: { color, bordercolor, emoji }
  }
};
```

Then register it in `seed/quizzes/index.js`:

```js
import myQuiz from './myQuiz.js';

export const quizzes = {
  // ...existing quizzes...
  [myQuiz.id]: myQuiz
};
```

Use HTML markup in the `question` field to insert page breaks and paragraphs for long questions. Seed the new quiz (`node src/seedQuizData.js my-quiz`), set it as `active_quiz` in `appconfig.js`, and restart the app.

## Scoring system and points

You can put either true or false values in the `score` field of a quiz's questions, or you can put a number of points in this field. If the `highlight_correct_answer` field in that quiz's `uiconfig` is set to true, the quiz will assume that you have true or false values in the score field, in which case choosing the correct answer will add 1 point to the final score. Make sure you use the same approach for all questions, don't mix booleans and numbers for different questions. Once you have passed the test, you will receive your final score. The final message is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected. MAX_SCORE gives you the fourth bottom line (when you have scored the maximum number of points available).

## Other options

Questions are displayed in randomised order if the `randomise_questions` option in the active quiz's `uiconfig` is set to true. Answers are displayed in randomised order if the `randomise_answers` option in the active quiz's `uiconfig` is set to true.

You can enable or disable the fireworks animation on the result screen by changing the `fireworks_on_result_screen` option in the active quiz's `uiconfig`.

## Add new languages to a quiz

You can add as many languages as you like to any quiz. Add the language to the quiz's `languages` array, then add matching entries to that quiz's `questions`, `localisations`, and `uiconfig` objects for the new language code, e.g.:

```js
languages: [
    {code: "en", name: "English"},
    {code: "uk", name: "Українська"}
],
```

After adding a new language, re-seed that quiz (e.g. `npm run seed:poetry`) and restart the app.

## Run development server

```sh
npm install
npm run seed
npm run start:dev
```

## Run production server

```sh
# Replace REDIS_URL with the address of the production Redis DB
export REDIS_URL="redis://localhost:6379"
npm install
npm run seed
npm run start:prod
```
