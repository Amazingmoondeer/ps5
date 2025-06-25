const startBtn = document.getElementById("startBtn");
const categorySelect = document.getElementById("category");
const quizContainer = document.querySelector(".quiz-container");
const startScreen = document.querySelector(".start-screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");

let quizData = [];
let currentQuestion = 0;
let score = 0;

// Decode HTML entities in questions from API
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Start quiz: fetch questions based on selected category
startBtn.onclick = async () => {
  const category = categorySelect.value;
  const url = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`;

  const response = await fetch(url);
  const data = await response.json();
  quizData = data.results.map(q => ({
    question: decodeHTML(q.question),
    options: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
    answer: decodeHTML(q.correct_answer)
  }));

  currentQuestion = 0;
  score = 0;

  startScreen.style.display = "none";
  quizContainer.style.display = "block";
  loadQuestion();
};

// Shuffle options
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Load one question
function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => selectOption(li, current.answer);
    optionsEl.appendChild(li);
  });

  nextBtn.style.display = "none";
}

// Handle answer selection
function selectOption(selectedLi, correctAnswer) {
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

// Next question or show score
nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showScore();
  }
};

// Show final score and save to local storage
function showScore() {
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  scoreEl.textContent = `Your score: ${score} / ${quizData.length}`;

  saveHighScore(score);
}

// Save score to local storage
function saveHighScore(score) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push({ date: new Date().toLocaleDateString(), score });
  localStorage.setItem("highScores", JSON.stringify(highScores));
}
