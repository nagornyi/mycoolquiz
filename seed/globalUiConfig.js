// These are the default settings used by every quiz. A quiz can override
// any of them in its own `uiconfig` (see seed/quizzes/*.js) — for example,
// just to change one score's emoji — without having to copy everything
// else from this file.
export const globalUiConfig = {
  // Text shown on buttons and labels, per language.
  en: {
    quiz_start_btn: "Start the quiz",
    next_question_btn: "Next",
    quiz_restart_btn: "Take the quiz again",
    number_of_questions: "Number of questions in the quiz",
    quiz_description: "Quiz description",
    final_result: "${score} out of ${MAX_SCORE} points"
  },
  uk: {
    quiz_start_btn: "Почати тест",
    next_question_btn: "Далі",
    quiz_restart_btn: "Пройти тест ще раз",
    number_of_questions: "Кількість питань у тесті",
    quiz_description: "Опис тесту",
    final_result: "${score} з ${MAX_SCORE} балів"
  },
  ja: {
    quiz_start_btn: "クイズを始める",
    next_question_btn: "次へ",
    quiz_restart_btn: "もう一度クイズを受ける",
    number_of_questions: "クイズの問題数",
    quiz_description: "クイズの説明",
    final_result: "${MAX_SCORE}点中${score}点"
  },
  // How the result screen looks for each score level.
  maxscore: {
    color: "#50C878",
    bordercolor: "orange",
    emoji: "🎊"
  },
  highscore: {
    color: "#50C878",
    bordercolor: "orange",
    emoji: "😻"
  },
  avgscore: {
    color: "#50C878",
    bordercolor: "orange",
    emoji: "😸"
  },
  lowscore: {
    color: "#50C878",
    bordercolor: "orange",
    emoji: "😼"
  },

  // Quiz behaviour, on by default.
  randomise_answers: true,
  randomise_questions: true,
  highlight_correct_answer: true,
  fireworks_on_result_screen: true
};
