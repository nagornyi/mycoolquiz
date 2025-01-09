# My Cool Quiz

A simple quiz application that was implemented using the Fastify web framework. You can create your own quiz by changing the data in the database seed files `seed/questions.js` and `seed/localisations.js`. You can put either true or false values in the `score` field of the `seed/questions.js` file, or you can put a number of points in this field. If the `randomise_answers` field in the `public/js/uiconfig.js` configuration file is set to true, the quiz will assume that you have true or false values in the score field, in which case choosing the correct answer will add 1 point to the final score. Make sure you use the same approach for all questions, don't mix booleans and numbers for different questions. Once you have passed the test, you will receive your final score. The final message is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected. MAX_SCORE gives you the fourth bottom line (when you have scored the maximum number of points available).

Questions are displayed in randomised order if the `randomise_questions` option in the `public/js/uiconfig.js` configuration file is set to true. Answers are displayed in randomised order if the `randomise_answers` option in the `public/js/uiconfig.js` configuration file is set to true.

Two languages are currently supported - English and Ukrainian, but you can add as many languages as you like. Don't forget to add localisations and questions for each language.

If you want to add more languages, you can add them in the `public/index.html` file:

```html
<button class="lang-btn" data-lang="uk">Українська</button>
<button class="lang-btn" data-lang="en">English</button>
```

After adding a new language, you would also need to localise UI elements in the `public/js/uiconfig.js` file.

## Run Development Server

```sh
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:dev
```

## Run Production Server

```sh
# Replace REDIS_URL with the address of the production Redis DB
export REDIS_URL="redis://localhost:6379"
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:prod
```
