# My Cool Quiz

Simple quiz application. You can create your own quiz by changing the data in the database seed files `seed/questions.js` and `seed/localisations.js`. After passing the test, you will receive a certain number of points. The final text (bottom line) is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected.

Two languages are currently supported - Ukrainian and English, but you can add as many languages as you like. Don't forget to add localisations and questions for each language.

If you want to add additional languages, they can be added in `public/index.html` file:

```html
<button class="lang-btn" data-lang="uk">Українська</button>
<button class="lang-btn" data-lang="en">English</button>
```

Also you would need to localise UI elements in `public/js/uiconfig.js` file.

## Run Development server

```sh
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:dev
```

## Run Production server

```sh
# Replace REDIS_URL with the address of Production Redis DB
export REDIS_URL="redis://localhost:6379"
npm install --registry https://registry.npmjs.org
npm run seed
npm run start:prod
```
