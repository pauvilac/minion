document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const scoreContainer = document.getElementById('score-container');
    const scoreElement = document.getElementById('score');
    const correctCounter = document.getElementById('correct-counter');
    const correctCountElement = document.getElementById('correct-count');
    const endGame = document.getElementById('end-game');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    fetch('preguntas.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            setNextQuestion();
        })
        .catch(error => console.error('Error cargando las preguntas:', error));

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setNextQuestion();
        } else {
            showScore();
        }
    });

    

    function setNextQuestion() {
        resetState();
        showQuestion(questions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => {
                selectAnswer(button, answer.correct);
            });
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.classList.add('hidden');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(button, correct) {
        Array.from(answerButtonsElement.children).forEach(btn => {
            btn.disabled = true;
            if (questions[currentQuestionIndex].answers.find(a => a.text === btn.innerText).correct) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        });
        if (correct) {
            score++;
            correctCountElement.innerText = score;
        }
        nextButton.classList.remove('hidden');
    }

    function showScore() {
        questionContainer.classList.add('hidden');
        endGame.classList.remove('hidden');
        scoreContainer.classList.remove('hidden');
        nextButton.classList.add('hidden');
        correctCounter.classList.add('hidden');
        scoreElement.innerText = `${score} de ${questions.length}`;
    }

    function showResult() {
        const scorea = score;
        // Guardamos la puntuación en el localStorage
        localStorage.setItem('score', scorea);
        // Redirigimos a result.html con el parámetro de intentos disponibles
        window.location.href = `result.html?tries=${scorea}`;
    }
    
    endGame.addEventListener('click', () => {
        showResult();
    });

    setNextQuestion();
});

