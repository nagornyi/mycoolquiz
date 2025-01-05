# My Cool Quiz

Simple quiz application. You can create your own quiz by changing the data in the files `js/questions.js`, `js/bottomlines.js` and `js/localisations.js`. After passing the test, you will receive a certain number of points. The final text (bottom line) is displayed according to the number of points.

The score range is divided into three equal segments using (MAX_SCORE - MIN_SCORE) / 3. Depending on which segment the score falls into, an emoji and a bottom line are selected.

Two languages are currently supported - Ukrainian and English, but you can add as many languages as you like. Don't forget to add localisations, questions and bottom lines for each language.

```html
<button class="lang-btn" data-lang="uk">Українська</button>
<button class="lang-btn" data-lang="en">English</button>
```
