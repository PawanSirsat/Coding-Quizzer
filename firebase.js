// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

// Your web app's Firebase configuration
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const addToFireBase = async (uname, uscore, uright, uwrong) => {
  try {
    // Add the student record to Firebase
    const docRef = await addDoc(collection(db, 'QuizDataBase'), {
      name: uname,
      score: uscore,
      right: uright,
      wrong: uwrong,
    })
    console.log('Student added with ID: ', docRef.id)
  } catch (error) {
    console.error('Error adding student: ', error)
  }
}
window.addToFireBase = addToFireBase

// Select the element by its 'id'
const studentListLink = document.getElementById('studentListLink')

studentListLink.addEventListener('click', async (e) => {
  console.log('Show Result :')
  var x = document.getElementById('myTopnav')
  if (x.className === 'topnav') {
    x.className += ' responsive'
  } else {
    x.className = 'topnav'
  }
  document.getElementById('quiz-form').style.display = 'none'
  const resultContainer = document.getElementById('results-container')
  resultContainer.innerHTML = ''
  resultContainer.style.display = 'block'
  //None to result
  const result = document.getElementById('result-container')
  result.innerHTML = ''
  result.style.display = 'none'
  //None
  const que = document.getElementById('question-container')
  que.innerHTML = ''
  que.style.display = 'none'

  try {
    // Retrieve student data and add it to 'result-container'
    const querySnapshot = await getDocs(collection(db, 'QuizDataBase'))
    querySnapshot.forEach((doc) => {
      const studentData = doc.data()
      const listItem = document.createElement('li')
      listItem.classList.add('student-list-item') // Add the main list item class

      // Create and style individual parts of the list item text
      const nameElement = document.createElement('span')
      nameElement.classList.add('student-name')
      nameElement.textContent = `Name: ${studentData.name}, `

      const scoreElement = document.createElement('span')
      scoreElement.classList.add('student-score')
      scoreElement.textContent = `Score: ${studentData.score}, `

      const correctElement = document.createElement('span')
      correctElement.classList.add('student-correct')
      correctElement.textContent = `Correct: ${studentData.right}, `

      const wrongElement = document.createElement('span')
      wrongElement.classList.add('student-wrong')
      wrongElement.textContent = `Wrong: ${studentData.wrong}`

      // Append styled elements to the list item
      listItem.appendChild(nameElement)
      listItem.appendChild(scoreElement)
      listItem.appendChild(correctElement)
      listItem.appendChild(wrongElement)

      resultContainer.appendChild(listItem) // Append the list item to 'result-container'
    })

    // ...
  } catch (error) {
    console.log('Error ' + error)
  }

  // You may want to add logic to handle errors appropriately.
})
