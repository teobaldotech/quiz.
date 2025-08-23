const quizData = {
    "Matemática": [
        {question: "Qual é o valor de 5 + 3?", options: ["6","7","8","9"], answer: "8"},
        {question: "Qual é a raiz quadrada de 81?", options: ["7","8","9","10"], answer: "9"},
        {question: "Quanto é 12 x 2?", options: ["22","24","26","28"], answer: "24"},
        {question: "Qual é o valor de 15 - 7?", options: ["7","8","9","10"], answer: "8"},
        {question: "Quanto é 100 ÷ 5?", options: ["20","25","30","15"], answer: "20"}
    ],
    "História": [
        {question: "Quem descobriu o Brasil?", options: ["Cabral","Vasco da Gama","Pedro Álvares","Colombo"], answer: "Cabral"},
        {question: "Em que ano começou a Segunda Guerra Mundial?", options: ["1914","1939","1945","1929"], answer: "1939"},
        {question: "Quem foi o primeiro presidente do Brasil?", options: ["Getúlio Vargas","Deodoro da Fonseca","Juscelino Kubitschek","Tancredo Neves"], answer: "Deodoro da Fonseca"},
        {question: "Qual civilização construiu as pirâmides do Egito?", options: ["Romanos","Maias","Egípcios","Gregos"], answer: "Egípcios"},
        {question: "Quem liderou a independência dos EUA?", options: ["George Washington","Abraham Lincoln","Thomas Jefferson","Benjamin Franklin"], answer: "George Washington"}
    ],
    "Ciências": [
        {question: "Qual é o planeta mais próximo do Sol?", options: ["Terra","Vênus","Mercúrio","Marte"], answer: "Mercúrio"},
        {question: "Qual é o gás que respiramos?", options: ["Oxigênio","Nitrogênio","Hidrogênio","Dióxido de Carbono"], answer: "Oxigênio"},
        {question: "Qual órgão bombeia sangue pelo corpo?", options: ["Pulmão","Coração","Fígado","Rim"], answer: "Coração"},
        {question: "Qual é a fórmula da água?", options: ["H2O","CO2","O2","NaCl"], answer: "H2O"},
        {question: "Qual animal é conhecido como rei da selva?", options: ["Leão","Tigre","Elefante","Lobo"], answer: "Leão"}
    ]
};

let currentQuiz = 0;
let selectedArea = '';
let areaScores = {"Matemática":0,"História":0,"Ciências":0};
let areaCompleted = {"Matemática":false,"História":false,"Ciências":false};

const areaSelectionEl = document.getElementById("areaSelection");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const finalBtn = document.getElementById("finalBtn");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.getElementById("progressBar");

function startQuiz(area) {
    selectedArea = area;
    currentQuiz = 0;
    areaScores[area] = 0;
    areaSelectionEl.style.display = "none";
    quizEl.style.display = "block";
    nextBtn.style.display = "none";
    restartBtn.style.display = "none";
    finalBtn.style.display = "none";
    resultEl.innerText = '';
    starsEl.innerHTML = '';
    progressBarContainer.style.display = "block";
    updateProgress();
    loadQuiz();
}

function loadQuiz() {
    const currentQuizData = quizData[selectedArea][currentQuiz];
    let optionsHtml = '';
    currentQuizData.options.forEach(option => {
        optionsHtml += `<label><input type="radio" name="answer" value="${option}"> ${option}</label>`;
    });
    quizEl.innerHTML = `<div class="question" style="opacity:0">${currentQuizData.question}</div><div class="options">${optionsHtml}</div>`;
    setTimeout(()=> { 
        document.querySelector(".question").style.opacity = 1; 
        addOptionListeners(); 
    }, 50);
}

function addOptionListeners() {
    const labels = document.querySelectorAll(".options label");
    labels.forEach(label => {
        label.addEventListener('click', () => {
            const selectedValue = label.querySelector("input").value;
            const correctAnswer = quizData[selectedArea][currentQuiz].answer;
            labels.forEach(l => l.classList.add('disabled'));
            if(selectedValue === correctAnswer) {
                label.classList.add("correct");
                areaScores[selectedArea]++;
            } else {
                label.classList.add("wrong");
                labels.forEach(l => {
                    if(l.querySelector("input").value === correctAnswer) l.classList.add("correct");
                });
            }
            updateStars();
            nextBtn.style.display = "inline-block";
        });
    });
}

function updateStars() {
    const total = quizData[selectedArea].length;
    const score = areaScores[selectedArea];
    let starCount = Math.round((score/total)*5);
    starsEl.innerHTML = '★'.repeat(starCount) + '☆'.repeat(5-starCount);
}

function updateProgress() {
    const progressPercent = ((currentQuiz) / quizData[selectedArea].length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

nextBtn.addEventListener('click', () => {
    currentQuiz++;
    nextBtn.style.display = "none";
    if(currentQuiz < quizData[selectedArea].length) {
        loadQuiz();
        updateProgress();
    } else {
        quizEl.style.display = "none";
        progressBarContainer.style.display = "none";
        areaCompleted[selectedArea] = true;
        resultEl.innerText = `Você acertou ${areaScores[selectedArea]} de ${quizData[selectedArea].length} em ${selectedArea}!`;
        restartBtn.style.display = "inline-block";
        areaSelectionEl.style.display = "block";
        if(areaScores[selectedArea] === quizData[selectedArea].length) triggerConfetti();
        if(Object.values(areaCompleted).every(v=>v)) finalBtn.style.display = "inline-block";
    }
});

function triggerConfetti() {
    for(let i=0;i<30;i++){
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random()*100 + '%';
        confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
        document.querySelector('.quiz-container').appendChild(confetti);
        setTimeout(()=> confetti.remove(), 1000);
    }
}

function restartQuiz() {
    startQuiz(selectedArea);
}

function showFinalResults() {
    let totalQuestions = 0, totalCorrect = 0;
    for(let area in quizData) {
        totalQuestions += quizData[area].length;
        totalCorrect += areaScores[area];
    }
    resultEl.innerText = `Resultado Final: ${totalCorrect} de ${totalQuestions} acertos em todas as áreas!`;
    finalBtn.style.display = "none";
}