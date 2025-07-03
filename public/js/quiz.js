import { uiconfig } from './uiconfig.js';
import { startFireworks, stopFireworks } from './fireworks.js';

const appContainer = document.getElementById('app');
const languageForm = document.getElementById('language-selection');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizInfo = document.getElementById('quiz-info');
const quizName = document.getElementById('quiz-name');
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// Default language
var selectedLanguage = 'uk';
var currentQuestionsIndex = 0;
var score = 0;

var questions = [];
var localisations = {};
var questionScores = {};

function selectQuizLanguage()  {
    resetState();
    languageForm.style.display = "block";
}

async function startQuiz()  {
    questionScores = encodeData({});
    currentQuestionsIndex = 0;
    score = 0;
    showQuestion();
}

function encodeData(data) {
    return btoa(JSON.stringify(data));
}

function decodeData(data) {
    return JSON.parse(atob(data));
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionsIndex];
    let questionNo = currentQuestionsIndex + 1;
    questionElement.innerHTML =  `${questionNo} / ${questions.length}<br><br>${currentQuestion.question}`;
    questionElement.style.display = 'block';

    // Randomize the answers if the configuration is set to true
    if (uiconfig.randomise_answers) {
        currentQuestion.answers = currentQuestion.answers.sort(() => Math.random() - 0.5);
    }

    // Store scores for the current question in the encoded JSON object
    questionScores = decodeData(questionScores);
    questionScores[currentQuestionsIndex] = currentQuestion.answers.map(answer => answer.score);
    questionScores = encodeData(questionScores);

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);

        // Add an event listener to handle answer selection
        button.addEventListener("click", () => selectAnswer(index));
    });

    nextButton.innerText = uiconfig[selectedLanguage].next_question_btn;
}

function resetState() {
  if (uiconfig.fireworks_on_result_screen) {
    stopFireworks();
  }
  appContainer.classList.remove("app-clear");
  appContainer.classList.add("app");
  languageForm.style.display = 'none';
  nextButton.style.display = 'none';
  quizInfo.style.display = 'none';
  answerButton.classList.remove('answer-revealed');
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
  setTimeout(() => window.scrollTo({ top: 0 }), 0);
}

// Select answer and mark it
function selectAnswer(answerIndex) {
  let decodedScores = decodeData(questionScores);
  const selectedScore = decodedScores[currentQuestionsIndex][answerIndex];
  const buttons = Array.from(answerButton.children);
  const selectedBtn = buttons[answerIndex];

  // Disable all buttons
  buttons.forEach(button => button.disabled = true);

  // Mark the selected button
  selectedBtn.classList.add("chosen");

  // Update score
  if (uiconfig.highlight_correct_answer) {
    if (selectedScore.toString().toLowerCase() === 'true') {
      selectedBtn.classList.add("correct");
      score++;
    } else {
      selectedBtn.classList.add("incorrect");
    }

    // Mark all correct answers (only class names, no DOM redraw)
    buttons.forEach((button, index) => {
      if (decodedScores[currentQuestionsIndex][index].toString().toLowerCase() === 'true') {
        button.classList.add("correct");
      }
    });
  } else {
    selectedBtn.classList.add("neutral");
    score += Number(selectedScore);
  }

  // Trigger CSS cascade with one class on the parent
  answerButton.classList.add("answer-revealed");

  nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.style.display = 'none';

    const MIN_SCORE = questions.reduce((minScore, question) => {
        const lowestScore = Math.min(...question.answers.map(answer => answer.score));
        return minScore + lowestScore;
    }, 0);
    const MAX_SCORE = questions.reduce((maxScore, question) => {
        const highestScore = Math.max(...question.answers.map(answer => answer.score));
        return maxScore + highestScore;
    }, 0);

    var final_msg = `<div class="final-score">🎉 ${uiconfig[selectedLanguage].final_result.replace(/\${score}/g, score).replace(/\${MAX_SCORE}/g, MAX_SCORE)}`;
    
    // Add emoji and result based on score
    var bottomLineText;
    var bottomLineEmoji;
    var bottomLineColor;
    var bottomLineBorderColor;
    if (score == MAX_SCORE) {
        // Max score
        bottomLineText = localisations.maxscore;
        bottomLineEmoji = uiconfig.maxscore.emoji;
        bottomLineColor = uiconfig.maxscore.color;
        bottomLineBorderColor = uiconfig.maxscore.bordercolor;
    } else if (score <= MIN_SCORE + (MAX_SCORE - MIN_SCORE) / 3) {
        // Low score
        bottomLineText = localisations.lowscore;
        bottomLineEmoji = uiconfig.lowscore.emoji;
        bottomLineColor = uiconfig.lowscore.color;
        bottomLineBorderColor = uiconfig.lowscore.bordercolor;
    } else if (score <= MIN_SCORE + 2 * (MAX_SCORE - MIN_SCORE) / 3) {
        // Average score
        bottomLineText = localisations.avgscore;
        bottomLineEmoji = uiconfig.avgscore.emoji;
        bottomLineColor = uiconfig.avgscore.color;
        bottomLineBorderColor = uiconfig.lowscore.bordercolor;
    } else {
        // High score
        bottomLineText = localisations.highscore;
        bottomLineEmoji = uiconfig.highscore.emoji;
        bottomLineColor = uiconfig.highscore.color;
        bottomLineBorderColor = uiconfig.lowscore.bordercolor;
    }
    final_msg += ` ${bottomLineEmoji}</div>${bottomLineText}<br>`;
    
    appContainer.classList.remove("app");
    appContainer.classList.add("app-clear");
    quizInfo.style.display = "block";
    quizInfo.style.color = bottomLineColor;
    quizInfo.style.borderColor = bottomLineBorderColor;
    quizInfo.classList.remove("framed-text");
    quizInfo.classList.add("framed-result");
    quizInfo.innerHTML = final_msg;
    nextButton.innerHTML = uiconfig[selectedLanguage].quiz_restart_btn;
    nextButton.style.display = "block";
    if (uiconfig.fireworks_on_result_screen) {
        startFireworks();
    }
}

// Handle language selection
document.addEventListener('DOMContentLoaded', function() {
  const languageButtons = document.querySelectorAll('.lang-btn');

  languageButtons.forEach(button => {
      button.addEventListener('click', async function() {
          languageButtons.forEach(btn => btn.classList.remove('selected'));
          this.classList.add('selected');
          selectedLanguage = this.getAttribute('data-lang');
          await initializeQuiz(selectedLanguage);
          languageForm.style.display = 'none';
          quizName.innerText = localisations.quiz_name;
          quizInfo.style.display = 'block';
          quizInfo.innerHTML = `<b>${uiconfig[selectedLanguage].number_of_questions}:</b> ${questions.length}
          <br><br>
          <b>${uiconfig[selectedLanguage].quiz_description}:</b> ${localisations.quiz_description}`;
          // Show the Start Quiz button
          startQuizBtn.innerText = uiconfig[selectedLanguage].quiz_start_btn;
          startQuizBtn.style.display = 'block';
      });
  });
});

startQuizBtn.addEventListener('click', async () => {
  startQuizBtn.style.display = 'none';
  await startQuiz();
});

function handleNextButton() {
    currentQuestionsIndex++;
    if (currentQuestionsIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", async () => {
    if (currentQuestionsIndex < questions.length) {
        handleNextButton();
    } else {
        await startQuiz();
    }
})

// Fetch data dynamically from Redis via the API
async function fetchData(endpoint) {
  try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
      return await response.json();
  } catch (error) {
      console.error(error);
      return null;
  }
}

// Initialize the quiz with the fetched localised data
async function initializeQuiz(lang) {
  questions = await fetchData(`/api/questions/${lang}`);
  localisations = await fetchData(`/api/localisations/${lang}`);
  
  if (!questions || !localisations) {
      console.error('Failed to initialize quiz due to missing data');
  }
}

selectQuizLanguage();
