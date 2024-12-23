const flashcards = [
  {
      question: "What is the capital of France?",
      answer: "Paris"
  },
  {
      question: "What is 2 + 2?",
      answer: "4"
  },
  {
      question: "What is the capital of Spain?",
      answer: "Madrid"
  }
];

let currentIndex = 0;

const questionElement = document.querySelector('.question');
const answerElement = document.querySelector('.answer');
const nextButton = document.getElementById('next');

function showFlashcard(index) {
  questionElement.textContent = flashcards[index].question;
  answerElement.textContent = flashcards[index].answer;
  answerElement.style.display = 'none';
}

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showFlashcard(currentIndex);
});

questionElement.addEventListener('click', () => {
  answerElement.style.display = 'block';
});

// Initialize the first flashcard
showFlashcard(currentIndex);