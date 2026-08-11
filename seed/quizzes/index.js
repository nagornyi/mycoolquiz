import poetry from './poetryQuiz.js';
import literaryEvening from './literaryEvening.js';

// Registry of all available quizzes, keyed by quiz id.
// To add a new quiz: create a new file in this folder exporting the same
// shape (id, title, languages, questions, localisations, uiconfig) and
// register it here.
export const quizzes = {
  [poetry.id]: poetry,
  [literaryEvening.id]: literaryEvening
};
