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
var selectedLanguage = 'en';
var currentQuestionsIndex = 0;
var score = 0;

var questions = [];
var localisations = {};

function selectQuizLanguage()  {
    resetState();
    quizName.innerText = "Quiz Language";
    languageForm.style.display = "block";
}

async function startQuiz()  {
    currentQuestionsIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionsIndex];
    let questionNo = currentQuestionsIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    questionElement.style.display = 'block';
    // Randomise the answers if the configuration is set to true
    if (uiconfig.randomise_answers) {
        currentQuestion.answers = currentQuestion.answers.sort(() => Math.random() - 0.5);
    }
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        button.dataset.score = Number(answer.score)
        button.addEventListener("click", selectAnswer)
    });

    nextButton.innerText = uiconfig[selectedLanguage].next_question_btn;
}

function resetState() {
    stopFireworks();
    appContainer.classList.remove("app-clear");
    appContainer.classList.add("app");
    languageForm.style.display = 'none';
    nextButton.style.display = 'none'
    quizInfo.style.display = 'none'
    while(answerButton.firstChild){
        answerButton.removeChild(answerButton.firstChild);
    }
    // Scroll to the top of the page
    window.scrollTo({ top: 0 });
}

function selectAnswer(e) {
    const selectedBtn = e.target    
    selectedBtn.classList.add("chosen");
    score += Number(selectedBtn.dataset.score);
    Array.from(answerButton.children).forEach(button => {
        button.disabled = true;
    });
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
    startFireworks();
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
  // Randomise the questions if the configuration is set to true
  if (uiconfig.randomise_questions) {
      questions = questions.sort(() => Math.random() - 0.5);
  }
  localisations = await fetchData(`/api/localisations/${lang}`);
  
  if (!questions || !localisations) {
      console.error('Failed to initialize quiz due to missing data');
  }
}

selectQuizLanguage();
