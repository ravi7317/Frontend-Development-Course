const questions = [
  {
    question: "What is HTML?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "Hyper Transfer Machine Language", correct: false },
      { text: "High Text Mark Language", correct: false },
      { text: "None of these", correct: false }
    ]
  },
  {
    question: "Which language is used for styling?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "Python", correct: false },
      { text: "JavaScript", correct: false }
    ]
  }
];

const questionElement = document.getElementById("question");   // make sure id="question" in HTML
const answerButtons = document.querySelectorAll(".btn");
const nextBtn = document.getElementById("next-btn");
const answerBox = document.getElementById("answer");

let currentQuestionIndex = 0;
let score = 0;
let selected = false; // user selected answer or not

function showQuestion() {
  selected = false;
  nextBtn.disabled = true;

  const q = questions[currentQuestionIndex];
  questionElement.innerText = q.question;

  answerButtons.forEach((btn, i) => {
    btn.innerText = q.answers[i].text;
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;

    btn.onclick = () => selectAnswer(q.answers[i].correct, btn);
  });

  nextBtn.innerText =
    currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
}

function selectAnswer(isCorrect, clickedBtn) {
  if (selected) return; // prevent multiple selections
  selected = true;

  if (isCorrect) {
    score++;
    clickedBtn.classList.add("correct");
  } else {
    clickedBtn.classList.add("wrong");
  }

  // disable all options after selection
  answerButtons.forEach(btn => (btn.disabled = true));

  // enable next
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  if (!selected) return;

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionElement.innerText = `Quiz Finished! Score: ${score}/${questions.length}`;
  answerBox.style.display = "none";
  nextBtn.style.display = "none";
}

showQuestion();
/1234