import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const quizzesDir = path.dirname(fileURLToPath(import.meta.url));

// Registry of all available quizzes, keyed by quiz id. Every other .js file
// in this folder is loaded automatically — to add a new quiz, just create
// e.g. seed/quizzes/myQuiz.js exporting an object with the shape (id, title,
// languages, questions, localisations, uiconfig) documented in README.md.
// No need to register it here.
//
// `uiconfig` is optional — a quiz only needs to list settings that should
// be different from the shared defaults in ../globalUiConfig.js.
const quizModules = await Promise.all(
  readdirSync(quizzesDir)
    .filter((file) => file.endsWith('.js') && file !== 'index.js')
    .map(async (file) => {
      const { default: quiz } = await import(`./${file}`);
      if (!quiz || typeof quiz.id !== 'string' || !quiz.id) {
        throw new Error(`Quiz file "${file}" must have a default export with a string "id" field.`);
      }
      return quiz;
    })
);

export const quizzes = {};
for (const quiz of quizModules) {
  if (quizzes[quiz.id]) {
    throw new Error(`Duplicate quiz id "${quiz.id}": used by more than one file in seed/quizzes/.`);
  }
  quizzes[quiz.id] = quiz;
}
