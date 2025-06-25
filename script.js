const startBtn = document.getElementById('startBtn');
const categorySelect = document.getElementById('category');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const startScreen = document.querySelector('.start-screen');
const quizContainer = document.querySelector('.quiz-container');

let quizData = [];
let currentQuestion = 0;
let score = 0;

// Decode HTML entities from API responses
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle answers
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Fetch and start quiz
startBtn.onclick = async () => {
  const category = categorySelect.value;
  const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`);
  const data = await response.json();

  quizData = data.results.map(q => ({
    question: decodeHTML(q.question),
    options: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
    answer: decodeHTML(q.correct_answer)
  }));

  currentQuestion = 0;
  score = 0;
  startScreen.style.display = 'none';
  quizContainer.style.display = 'block';
  loadQuestion();
};

function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = '';
  scoreEl.textContent = '';
  nextBtn.style.display = 'none';

  current.options.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option;
    li.onclick = () => selectAnswer(li, current.answer);
    optionsEl.appendChild(li);
  });
}

function selectAnswer(selectedLi, correctAnswer) {
  const options = optionsEl.querySelectorAll('li');
  options.forEach(li => li.onclick = null); // Disable all

  if (selectedLi.textContent === correctAnswer) {
    selectedLi.style.background = '#b6fcb6';
    score++;
  } else {
    selectedLi.style.background = '#fcb6b6';
    options.forEach(li => {
      if (li.textContent === correctAnswer) {
        li.style.background = '#b6fcb6';
      }
    });
  }

  nextBtn.style.display = 'block';
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
};

function showFinalScore() {
  questionEl.textContent = 'Quiz Completed!';
  optionsEl.innerHTML = '';
  nextBtn.style.display = 'none';
  scoreEl.textContent = `You scored ${score} out of ${quizData.length}`;
}
