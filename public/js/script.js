import { uiconfig } from './uiconfig.js';

const languageForm = document.getElementById('language-selection');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizInfo = document.getElementById('quiz-info');
const quizName = document.getElementById('quiz-name');
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// Default language
let selectedLanguage = 'uk';
var questions = [];
var localisations = {};

let currentQuestionsIndex = 0;
let score = 0;

function selectQuizLanguage()  {
    resetState();
    quizName.innerText = "Language";
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
    languageForm.style.display = 'none';    
    nextButton.style.display = 'none'    
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

    var final_msg = `<b>${uiconfig[selectedLanguage].final_score_msg_1}: ${score} ${uiconfig[selectedLanguage].final_score_msg_2} ${MAX_SCORE}</b>`;
    
    // Add emoji and result based on score
    var bottomLineText;
    var bottomLineEmoji;
    var bottomLineColor;
    if (score <= MIN_SCORE + (MAX_SCORE - MIN_SCORE) / 3) {
        bottomLineText = localisations.lowscore;
        bottomLineEmoji = uiconfig.lowscore.emoji;
        bottomLineColor = uiconfig.lowscore.color;
    } else if (score <= MIN_SCORE + 2 * (MAX_SCORE - MIN_SCORE) / 3) {
        bottomLineText = localisations.avgscore;
        bottomLineEmoji = uiconfig.avgscore.emoji;
        bottomLineColor = uiconfig.avgscore.color;
    } else {
        bottomLineText = localisations.highscore;
        bottomLineEmoji = uiconfig.highscore.emoji;
        bottomLineColor = uiconfig.highscore.color;
    }
    final_msg += ` ${bottomLineEmoji}<br><br>${bottomLineText}<br>`;
    
    quizInfo.style.display = "block";
    quizInfo.style.borderColor = bottomLineColor;
    quizInfo.style.color = bottomLineColor;
    quizInfo.innerHTML = final_msg;
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
          quizInfo.innerHTML = localisations.quiz_description;
          // Show the Start Quiz button
          startQuizBtn.innerText = uiconfig[selectedLanguage].quiz_start_btn;
          startQuizBtn.style.display = 'block';          
      });
  });
});

startQuizBtn.addEventListener('click', async () => {
  startQuizBtn.style.display = 'none';
  quizInfo.style.display = 'none';
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