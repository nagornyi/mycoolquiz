# My Cool Quiz

A simple quiz application that is implemented using the Fastify web framework, with a Preact frontend. The app can host multiple quizzes, each with its own questions, localisations, and result-screen styling — but only one quiz is served (active) at a time. Each quiz can be localised into multiple languages.

## Quizzes bundled with this app

- `poetry-quiz` — a classic English/Ukrainian poetry quiz.
- `literary-evening` — a Ukrainian/Japanese literature quiz about writers and poets.

Every quiz lives in its own file under `seed/quizzes/`, and every file there is loaded automatically — no separate registration step needed.

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
  // Optional. Only needed if this quiz should behave or look different from
  // the shared defaults in seed/globalUiConfig.js (see below). You can
  // override as much or as little as you like, e.g.:
  uiconfig: {
    randomise_questions: false,
    maxscore: { emoji: "🏆" }
  }
};
```

Use HTML markup in the `question` field to insert page breaks and paragraphs for long questions. Seed the new quiz (`node src/seedQuizData.js my-quiz`), set it as `active_quiz` in `appconfig.js`, and restart the app.

## Shared UI settings

Most quizzes look and behave the same way, so their common settings live in one place: `seed/globalUiConfig.js`. This file provides:

- Button and label text for the `en`, `uk`, and `ja` languages (e.g. "Start the quiz", "Next").
- The color, border color, and emoji shown on the result screen for each score level (`maxscore`, `highscore`, `avgscore`, `lowscore`).
- The default on/off settings described in [Other options](#other-options) below.

When a quiz is seeded, its own `uiconfig` (if any) is layered on top of these defaults. A quiz's `uiconfig` can be left out entirely, or it can override just the parts it needs to change — down to a single setting, such as one score level's emoji — without repeating everything else from `seed/globalUiConfig.js`.

## Scoring system and points

You can put either true or false values in the `score` field of a quiz's questions, or you can put a number of points in this field. If the `highlight_correct_answer` field in that quiz's `uiconfig` is set to true, the quiz will assume that you have true or false values in the score field, in which case choosing the correct answer will add 1 point to the final score. Make sure you use the same approach for all questions, don't mix booleans and numbers for different questions. Once you have passed the test, you will receive your final score. The final message is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected. MAX_SCORE gives you the fourth bottom line (when you have scored the maximum number of points available).

## Other options

By default, questions and answers are shown in a random order each time, the correct answer is highlighted after you pick one, and fireworks play on the result screen. Any quiz can turn these off (or back on) individually by setting the matching option in its own `uiconfig`:

- `randomise_questions` — show the questions in random order.
- `randomise_answers` — show each question's answers in random order.
- `highlight_correct_answer` — reveal the correct answer once you've picked one.
- `fireworks_on_result_screen` — play the fireworks animation on the result screen.

For example, to turn off question randomisation for one quiz only, set `uiconfig: { randomise_questions: false }` in that quiz's file.

## Add new languages to a quiz

You can add as many languages as you like to any quiz. Add the language to the quiz's `languages` array, then add matching entries to that quiz's `questions` and `localisations` objects for the new language code. Button/label text for `en`, `uk`, and `ja` is already provided by `seed/globalUiConfig.js`; for any other language code, add a matching entry under that quiz's own `uiconfig`, e.g.:

```js
uiconfig: {
  fr: { quiz_start_btn, next_question_btn, quiz_restart_btn, number_of_questions, quiz_description, final_result }
}
```

Also add the language to the `languages` array:

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
npm run build
npm run seed
npm run start:dev
```

The frontend lives in `frontend/` (Preact) and is bundled by Vite into `public/dist/main.js`, which is served alongside the rest of `public/` by Fastify. Re-run `npm run build` after changing anything under `frontend/`.

## Run production server

```sh
# Replace REDIS_URL with the address of the production Redis DB
export REDIS_URL="redis://localhost:6379"
npm install
npm run build
npm run seed
npm run start:prod
```

When deploying (e.g. on Render), set the build command to `npm install && npm run build` and the start command to `npm run start:prod`, so the frontend bundle is produced before the server starts.
