// Unbiased Fisher-Yates shuffle. Array#sort(() => Math.random() - 0.5) is a
// common but statistically biased way to shuffle, so we do it properly here.
// Shared by the backend (app.js) and frontend (App.jsx) so both randomise
// consistently.
export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
