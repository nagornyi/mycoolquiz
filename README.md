# My Cool Quiz

A simple quiz application that is implemented using the Fastify web framework. Only ONE quiz can be created in this app, but you can localise this quiz into multiple languages.

## Add localised questions to your quiz

You can create your own custom quiz by changing the data in the database seed files `seed/questions.js` and `seed/localisations.js`, then run `npm run seed` to update the database and restart the app. Use HTML markup to insert page breaks and paragraphs for long questions. You can change the quiz title in the `appconfig.js` configuration file. As it comes before the language selection of the quiz, this title is not localised.

## Scoring system and points

You can put either true or false values in the `score` field of the `seed/questions.js` file, or you can put a number of points in this field. If the `highlight_correct_answer` field in the `public/js/uiconfig.js` configuration file is set to true, the quiz will assume that you have true or false values in the score field, in which case choosing the correct answer will add 1 point to the final score. Make sure you use the same approach for all questions, don't mix booleans and numbers for different questions. Once you have passed the test, you will receive your final score. The final message is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected. MAX_SCORE gives you the fourth bottom line (when you have scored the maximum number of points available).

## Other options

Questions are displayed in randomised order if the `randomise_questions` option in the `appconfig.js` configuration file is set to true. Answers are displayed in randomised order if the `randomise_answers` option in the `public/js/uiconfig.js` configuration file is set to true.

You can enable or disable the fireworks animation on the result screen by changing the `fireworks_on_result_screen` option in the `public/js/uiconfig.js` configuration file.

## Add new languages to the quiz

Two languages are currently supported - English and Ukrainian, but you can add as many languages as you like. Don't forget to add localisations and questions for each language.

If you want to add more languages, you can add them to the `quiz_languages` array in the `appconfig.js` configuration file:

```js
quiz_languages: [
    {code: "en", name: "English"},
    {code: "uk", name: "Українська"}
],
```

After adding a new language, you would also need to add the questions and localisations for the new language to the `seed/questions.js`, `seed/localisations.js` and `public/js/uiconfig.js` files, then run `npm run seed` to update the database and restart the app.

## Run development server

```sh
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:dev
```

## Run production server

```sh
# Replace REDIS_URL with the address of the production Redis DB
export REDIS_URL="redis://localhost:6379"
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:prod
```
