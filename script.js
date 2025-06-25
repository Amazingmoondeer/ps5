const startBtn = document.getElementById('startBtn');
const categorySelect = document.getElementById('category');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const startScreen = document.querySelector('.start-screen');
const quizContainer = document.querySelector('.quiz-container');
const imgEl = document.getElementById('question-img');

let quizData = [];
let currentQuestion = 0;
let score = 0;

// Custom questions with images
const customQuestions = [
  {
    question: "Which animal is this?",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
    options: ["Tiger", "Lion", "Leopard", "Cheetah"],
    answer: "Lion"
  },
  {
    question: "Which planet is shown in this image?",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Mercury_in_true_color.jpg",
    options: ["Mercury", "Mars", "Venus", "Earth"],
    answer: "Mercury"
  }
];

// HTML decode function
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

startBtn.onclick = async () => {
  const category = categorySelect.value;
  score = 0;
  currentQuestion = 0;

  if (category === "custom") {
    quizData = customQuestions.map(q => ({
      ...q,
      options: shuffle([...q.options])
    }));
    showQuiz();
  } else {
    const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`);
    const data = await response.json();
    quizData = data.results.map(q => ({
      question: decodeHTML(q.question),
      options: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
      answer: decodeHTML(q.correct_answer),
      image: null
    }));
    showQuiz();
  }
};

function showQuiz() {
  startScreen.style.display = "none";
  quizContainer.style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  scoreEl.textContent = '';
  nextBtn.style.display = 'none';

  if (q.image) {
    imgEl.src = q.image;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  q.options.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option;
    li.onclick = () => selectAnswer(li, q.answer);
    optionsEl.appendChild(li);
  });
}

function selectAnswer(selectedLi, correctAnswer) {
  const options = optionsEl.querySelectorAll("li");
  options.forEach(li => li.onclick = null);

  if (selectedLi.textContent === correctAnswer) {
    selectedLi.style.background = "#b6fcb6";
    score++;
  } else {
    selectedLi.style.background = "#fcb6b6";
    options.forEach(li => {
      if (li.textContent === correctAnswer) {
        li.style.background = "#b6fcb6";
      }
    });
  }

  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = '';
    imgEl.style.display = 'none';
    nextBtn.style.display = 'none';
    scoreEl.textContent = `You scored ${score} out of ${quizData.length}`;
  }
};
