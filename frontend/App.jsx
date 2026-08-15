import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import { Check, X } from 'lucide-preact';
import { fetchData } from './api.js';
import { startFireworks, stopFireworks } from './fireworks.js';
import { shuffle } from '../shared/shuffle.js';

const STAGE = {
  LOADING: 'loading',
  ERROR: 'error',
  LANGUAGE: 'language',
  INFO: 'info',
  QUESTION: 'question',
  SCORE: 'score',
};

export function App() {
  const [stage, setStage] = useState(STAGE.LOADING);
  const [meta, setMeta] = useState(null);
  const [uiconfig, setUiconfig] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [localisations, setLocalisations] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [playthroughId, setPlaythroughId] = useState(0);

  const canvasRef = useRef(null);

  // Load the active quiz's metadata and UI config on mount
  useEffect(() => {
    (async () => {
      const [metaData, uiconfigData] = await Promise.all([
        fetchData('/api/meta'),
        fetchData('/api/uiconfig'),
      ]);
      if (!metaData || !uiconfigData) {
        setStage(STAGE.ERROR);
        return;
      }
      setMeta(metaData);
      setUiconfig(uiconfigData);
      setStage(STAGE.LANGUAGE);
    })();
  }, []);

  // Shuffle each question's answers once per question, per playthrough
  const preparedQuestions = useMemo(() => {
    if (!uiconfig.randomise_answers) return questions;
    return questions.map((q) => ({
      ...q,
      answers: shuffle(q.answers),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, playthroughId]);

  async function selectLanguage(langCode) {
    setSelectedLanguage(langCode);
    const [questionsData, localisationsData] = await Promise.all([
      fetchData(`/api/questions/${langCode}`),
      fetchData(`/api/localisations/${langCode}`),
    ]);
    if (!questionsData || !localisationsData) {
      setStage(STAGE.ERROR);
      return;
    }
    setQuestions(questionsData);
    setLocalisations(localisationsData);
    setStage(STAGE.INFO);
  }

  function startQuiz() {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswerIndex(null);
    setPlaythroughId((id) => id + 1);
    setStage(STAGE.QUESTION);
  }

  function selectAnswer(index) {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);
    const chosen = preparedQuestions[currentIndex].answers[index];
    if (uiconfig.highlight_correct_answer) {
      if (chosen.score.toString().toLowerCase() === 'true') {
        setScore((s) => s + 1);
      }
    } else {
      setScore((s) => s + Number(chosen.score));
    }
  }

  function handleNext() {
    if (stage === STAGE.SCORE) {
      startQuiz();
      return;
    }
    const nextIndex = currentIndex + 1;
    setSelectedAnswerIndex(null);
    if (nextIndex < preparedQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setStage(STAGE.SCORE);
    }
  }

  // Start/stop the fireworks animation as we enter/leave the score screen
  useEffect(() => {
    if (stage === STAGE.SCORE && uiconfig.fireworks_on_result_screen && canvasRef.current) {
      startFireworks(canvasRef.current);
      return () => stopFireworks(canvasRef.current);
    }
  }, [stage, uiconfig.fireworks_on_result_screen]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage, currentIndex]);

  if (stage === STAGE.LOADING) {
    return (
      <div id="app" class="app">
        <h1>Loading…</h1>
      </div>
    );
  }

  if (stage === STAGE.ERROR) {
    return (
      <div id="app" class="app">
        <h1>Something went wrong</h1>
        <p>Failed to load the quiz. Please try refreshing the page.</p>
      </div>
    );
  }

  const isScoreStage = stage === STAGE.SCORE;
  const currentQuestion = preparedQuestions[currentIndex];
  const lang = selectedLanguage;

  return (
    <div id="app" class={isScoreStage ? 'app-clear' : 'app'}>
      <h1
        id="quiz-name"
        dangerouslySetInnerHTML={{
          __html: stage === STAGE.LANGUAGE ? meta.title : (localisations.quiz_name || meta.title),
        }}
      />

      {stage === STAGE.LANGUAGE && (
        <div id="language-selection">
          {meta.languages.map((l) => (
            <button
              key={l.code}
              class="lang-btn"
              onClick={() => selectLanguage(l.code)}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      {stage === STAGE.INFO && (
        <button id="start-quiz-btn" onClick={startQuiz}>
          {uiconfig[lang].quiz_start_btn}
        </button>
      )}

      <div class="quiz">
        {stage === STAGE.INFO && (
          <div id="quiz-info" class="framed-text">
            <b>{uiconfig[lang].number_of_questions}:</b> {preparedQuestions.length}
            <br />
            <br />
            <b>{uiconfig[lang].quiz_description}:</b>{' '}
            <span dangerouslySetInnerHTML={{ __html: localisations.quiz_description }} />
          </div>
        )}

        {stage === STAGE.QUESTION && currentQuestion && (
          <>
            <div
              class="progress-bar"
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin="0"
              aria-valuemax={preparedQuestions.length}
            >
              <div
                class="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / preparedQuestions.length) * 100}%` }}
              />
            </div>
            <h2
              id="question"
              dangerouslySetInnerHTML={{
                __html: `${currentIndex + 1} / ${preparedQuestions.length}<br><br>${currentQuestion.question}`,
              }}
            />
            <div id="answer-buttons" class={selectedAnswerIndex !== null ? 'answer-revealed' : ''}>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerButton
                  key={`${currentIndex}-${index}`}
                  answer={answer}
                  index={index}
                  selectedAnswerIndex={selectedAnswerIndex}
                  uiconfig={uiconfig}
                  onSelect={selectAnswer}
                />
              ))}
            </div>
          </>
        )}

        {isScoreStage && (
          <ScoreScreen
            score={score}
            questions={preparedQuestions}
            uiconfig={uiconfig}
            localisations={localisations}
            lang={lang}
          />
        )}

        <div class="button-container">
          {((stage === STAGE.QUESTION && selectedAnswerIndex !== null) || isScoreStage) && (
            <button id="next-btn" onClick={handleNext}>
              {isScoreStage ? uiconfig[lang].quiz_restart_btn : uiconfig[lang].next_question_btn}
            </button>
          )}
        </div>
      </div>

      <canvas id="fireworks" ref={canvasRef}></canvas>
    </div>
  );
}

function AnswerButton({ answer, index, selectedAnswerIndex, uiconfig, onSelect }) {
  const isChosen = selectedAnswerIndex === index;
  const revealed = selectedAnswerIndex !== null;
  let stateClass = '';
  if (revealed) {
    if (uiconfig.highlight_correct_answer) {
      const isCorrect = answer.score.toString().toLowerCase() === 'true';
      if (isCorrect) stateClass = 'correct';
      else if (isChosen) stateClass = 'incorrect';
    } else if (isChosen) {
      stateClass = 'neutral';
    }
  }
  return (
    <button
      class={`btn${isChosen ? ' chosen' : ''}${stateClass ? ' ' + stateClass : ''}`}
      disabled={revealed}
      onClick={() => onSelect(index)}
    >
      {stateClass === 'correct' && <Check class="answer-icon" size={18} strokeWidth={2.5} aria-hidden="true" />}
      {stateClass === 'incorrect' && <X class="answer-icon" size={18} strokeWidth={2.5} aria-hidden="true" />}
      <span dangerouslySetInnerHTML={{ __html: answer.text }} />
    </button>
  );
}

function ScoreScreen({ score, questions, uiconfig, localisations, lang }) {
  const MIN_SCORE = questions.reduce(
    (min, q) => min + Math.min(...q.answers.map((a) => a.score)),
    0,
  );
  const MAX_SCORE = questions.reduce(
    (max, q) => max + Math.max(...q.answers.map((a) => a.score)),
    0,
  );

  let bucket;
  if (score === MAX_SCORE) bucket = 'maxscore';
  else if (score <= MIN_SCORE + (MAX_SCORE - MIN_SCORE) / 3) bucket = 'lowscore';
  else if (score <= MIN_SCORE + (2 * (MAX_SCORE - MIN_SCORE)) / 3) bucket = 'avgscore';
  else bucket = 'highscore';

  const bottomLineText = localisations[bucket];
  const { color, bordercolor, emoji } = uiconfig[bucket];
  const finalMsg = uiconfig[lang].final_result
    .replace(/\$\{score\}/g, score)
    .replace(/\$\{MAX_SCORE\}/g, MAX_SCORE);

  return (
    <div id="quiz-info" class="framed-result" style={{ color, borderColor: bordercolor }}>
      <div class="final-score">🎉 {finalMsg} {emoji}</div>
      <span dangerouslySetInnerHTML={{ __html: bottomLineText }} />
      <br />
    </div>
  );
}
