const questionContainer = document.getElementById('question-container')
const sliderLabel = document.querySelector('#slidertext')
const progressContainers = document.getElementsByClassName('progress-container')
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  where,
  query,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

// Your web app's Firebase configuration
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

//Retrive Function
async function getFireBaseJSON(lang, level) {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'question'),
      where('questionData.lang', '==', lang),
      where('questionData.level', '==', level)
    )
  )
  return querySnapshot
}
let quizData
let importData = []
let currentQuestionIndex = 0
let correct, wrong, userlength
let timeout = false

// Add an event listener to the checkbox
let timer = true
const quizSlider = document.getElementById('quiz-slider').checked
if (quizSlider) {
  sliderLabel.textContent = 'On'
  console.log(sliderLabel.textContent)
  sliderLabel.classList.add('slider-label-on')
}

document.getElementById('quiz-slider').addEventListener('change', function () {
  if (this.checked) {
    timer = true
    sliderLabel.textContent = 'On'
    sliderLabel.classList.remove('slider-label-off')
    sliderLabel.classList.add('slider-label-on')
    console.log('Timer ' + timer)
  } else {
    timer = false
    console.log('Timer ' + timer)
    sliderLabel.textContent = 'Off'
    sliderLabel.classList.remove('slider-label-on')
    sliderLabel.classList.add('slider-label-off')
  }
  // console.log('Slider ' + quizSlider)
})

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

async function loadQuizData(language, difficulty) {
  try {
    const data = await getFireBaseJSON(language, difficulty)
    console.log('Data Loaded')

    data.forEach((doc) => {
      const JSONData = doc.data().questionData
      importData.push(JSONData)
    })
    console.log(importData)

    //Filter By Difficulty Level
    quizData = importData
    //Define length
    if (userlength > quizData.length) {
      userlength = quizData.length
    }
    console.log('Length ' + userlength)

    shuffleArray(quizData)
    //Display First Que
    displayQuestion(currentQuestionIndex)
  } catch (error) {
    console.error('Error loading quiz data:', error)
  }
}

function startQuiz() {
  const language = document.getElementById('language').value
  const difficulty = document.getElementById('difficulty').value
  userlength = document.getElementById('quiz-type').value

  correct = 0
  wrong = 0

  if (language === 'none' || difficulty === 'none') {
    alert('Please select a language and difficulty level.')
    return
  }
  loadQuizData(language, difficulty)
  document.getElementById('quiz-form').style.display = 'none'
}

function displayQuestion(questionIndex) {
  timeout = false

  questionContainer.style.display = 'block'
  const question = quizData[questionIndex]

  const shuffledOptions = [...question.options]
  console.log('Options ')
  console.log(shuffledOptions)
  console.log('Ans ')
  console.log(quizData[questionIndex].ans)
  shuffleArray(shuffledOptions)
  if (!question) {
    endQuiz()
    return
  }
  const questionHTML = `
  <div class="progress-container">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
          <h2>${question.question}</h2>
          <ul>
  ${shuffledOptions
    .map(
      (option, index) => `
        <div class="option">
          <input type="radio" name="answer" value="${index}" id="option${index}" />
          <label for="option${index}">${option}</label>
        </div>`
    )
    .join('')}
</div>
          </ul>
          <div id="feedback-container" class="feedback"></div>
          <div class="btncontainer">
          <button type="button" id="btn" 
           >Submit</button>
          <button type="button" id="btn2">Next Quiz</button>
          <button type="button" id="btn3">Exit</button>
          </div>
           <div id="popup" class="popup">
       <div class="popup-content">
    <span class="close-button" id="closePopup">&times;</span>
    <h2>Quiz Exit Confirmation</h2>
    <p>If you exit, any unsaved progress will be lost.</p>
    <button id="reloadPage">Exit Quiz</button>
</div>

    </div>
        `
  questionContainer.innerHTML = questionHTML
  console.log('Timer ' + timer)
  setTimeout(function () {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }, 100) // Adjust the delay (in milliseconds) as needed
  document.getElementById('popup').style.display = 'none'

  document.getElementById('btn3').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'flex'
  })

  document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none'
  })

  document.getElementById('reloadPage').addEventListener('click', function () {
    location.reload()
  })

  if (!timer) {
    for (const container of progressContainers) {
      container.style.display = 'none'
    }
  } else {
    for (const container of progressContainers) {
      container.style.display = 'block'
    }
    console.log('Progress Start')
  }
  currentQuestionIndex = questionIndex

  const submitButton = document.getElementById('btn')
  submitButton.addEventListener('click', function () {
    checkAnswer(currentQuestionIndex)
  })

  const nextButton = document.getElementById('btn2')
  nextButton.addEventListener('click', function () {
    displayNextQuestion(currentQuestionIndex)
  })
}

function checkAnswer(questionIndex) {
  console.log('Check')
  const progressBar = document.getElementById('progress-bar')
  progressBar.style.width = '100%'

  let selectedAnswerText
  progressBar.style.width = '0%' // Initially set to 0%

  const selectedRadioButton = document.querySelector(
    'input[name="answer"]:checked'
  )
  if (selectedRadioButton) {
    selectedAnswerText = selectedRadioButton.nextElementSibling.textContent
    console.log(selectedAnswerText)
  } else {
    console.log('Please select an option.')
  }

  if (!selectedAnswerText && timeout == false) {
    console.log(selectedAnswerText)
    alert('Please select an answer')
    return
  } else {
    console.log('Option selected')
  }
  const correctAnswerText = quizData[questionIndex].ans

  document.getElementById('btn2').style.display = 'block'
  document.getElementById('btn').style.display = 'none'
  if (timeout == true) {
    disableQuizOptions()
    wrong++
    console.log('Time Out, selected, not submitted ')
  } else if (!selectedAnswerText) {
    alert('Please select an answer.')
    return
  } else {
    if (selectedAnswerText === correctAnswerText && timeout == false) {
      console.log('In Time, selected, submitted ')
      correct++
    } else {
      wrong++
    }
  }
}
function displayNextQuestion() {
  document.getElementById('btn').style.display = 'block'
  document.getElementById('btn2').style.display = 'none'

  if (currentQuestionIndex < userlength - 1) {
    displayQuestion(currentQuestionIndex + 1)
  } else {
    document.getElementById('question-container').style.display = 'none'
    result.style.display = 'block'
    win()
    const innerHTML = `
              <h2>Quiz completed!</h2>
              <h3>Score :  ${correct} / ${correct + wrong} </h3>
              <h3 id="res">Correct : ${correct}</h3>
              <h3 id="res">Wrong : ${wrong}</h3>
              <button type="button" class="btncss" onclick="startAgain()">Start Again</button>
    `
    result.innerHTML = innerHTML
    const uname = document.getElementById('name').value

    window.addToFireBase(uname, correct, correct, wrong)
    // alert('No more questions.')
  }
}
function endQuiz() {
  const questionContainer = document.getElementById('question-container')
  questionContainer.innerHTML = '<h2>Quiz completed!</h2>'
}

document.getElementById('quiz-form').addEventListener('submit', function (e) {
  e.preventDefault()
  startQuiz()
})
