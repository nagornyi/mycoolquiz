import {localisations} from './localisations.js'
import {bottomlines} from './bottomlines.js'
import {questions} from './questions.js'

const languageForm = document.getElementById('language-selection');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizInfo = document.getElementById('quiz-info');
const quizName = document.getElementById('quiz-name');
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// Default language
let selectedLanguage = 'uk';

let currentQuestionsIndex = 0;
let score = 0;

function selectQuizLanguage()  {
    resetState();
    quizName.innerText = "Language";
    languageForm.style.display = "block";
}

function startQuiz()  {
    currentQuestionsIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[selectedLanguage][currentQuestionsIndex];
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

    nextButton.innerText = localisations[selectedLanguage].next_question_btn;
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

    const MIN_SCORE = questions[selectedLanguage].reduce((minScore, question) => {
        const lowestScore = Math.min(...question.answers.map(answer => answer.score));
        return minScore + lowestScore;
    }, 0);
    const MAX_SCORE = questions[selectedLanguage].reduce((maxScore, question) => {
        const highestScore = Math.max(...question.answers.map(answer => answer.score));
        return maxScore + highestScore;
    }, 0);

    var final_msg = `<b>${localisations[selectedLanguage].final_score_msg_1}: ${score} ${localisations[selectedLanguage].final_score_msg_2} ${MAX_SCORE}</b>`;
    
    // Add emoji and result based on score
    var bottomLine;
    if (score <= MIN_SCORE + (MAX_SCORE - MIN_SCORE) / 3) {        
        bottomLine = bottomlines.lowscore;
    } else if (score <= MIN_SCORE + 2 * (MAX_SCORE - MIN_SCORE) / 3) {        
        bottomLine = bottomlines.avgscore;
    } else {        
        bottomLine = bottomlines.highscore;
    }    
    final_msg += ` ${bottomLine.emoji}<br><br>${bottomLine[selectedLanguage]}<br>`;
    
    quizInfo.style.display = "block";
    quizInfo.style.borderColor = bottomLine.color;
    quizInfo.style.color = bottomLine.color;
    quizInfo.innerHTML = final_msg;
}

// Handle language selection
document.addEventListener('DOMContentLoaded', function() {
  const languageButtons = document.querySelectorAll('.lang-btn');

  languageButtons.forEach(button => {
      button.addEventListener('click', function() {
          languageButtons.forEach(btn => btn.classList.remove('selected'));
          this.classList.add('selected');
          selectedLanguage = this.getAttribute('data-lang');
          languageForm.style.display = 'none';
          quizName.innerText = localisations[selectedLanguage].quiz_name;
          quizInfo.style.display = 'block';
          quizInfo.innerHTML = localisations[selectedLanguage].quiz_description;
          // Show the Start Quiz button
          startQuizBtn.innerText = localisations[selectedLanguage].quiz_start_btn;
          startQuizBtn.style.display = 'block';          
      });
  });
});

startQuizBtn.addEventListener('click', () => {
  startQuizBtn.style.display = 'none';
  quizInfo.style.display = 'none';
  startQuiz();
});

function handleNextButton() {
    currentQuestionsIndex++;
    if (currentQuestionsIndex < questions[selectedLanguage].length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionsIndex < questions[selectedLanguage].length) {
        handleNextButton();
    } else {
        startQuiz();
    }
})

selectQuizLanguage();
