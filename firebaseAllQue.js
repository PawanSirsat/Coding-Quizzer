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

document.getElementById('allQue').addEventListener('click', async (e) => {
  document.getElementById('pop3').style.display = 'flex'

  document.getElementById('closePopup3').addEventListener('click', function () {
    document.getElementById('pop3').style.display = 'none'
  })
})

//Show Data
document
  .getElementById('filter-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault()

    var selectedLanguage = document.getElementById('languageinputque').value
    var selectedLevel = document.getElementById('levelinput').value
    const resultContainer = document.getElementById('allquestion-container')
    resultContainer.style.display = 'block'

    document.getElementById('filter-form').reset()
    document.getElementById('filterdata').style.display = 'none'

    console.log(selectedLanguage)
    console.log(selectedLevel)

    // Create a reference to the cities collection
    try {
      // Retrieve student data and add it to 'result-container'
      const querySnapshot = await getDocs(
        query(
          collection(db, 'questions'),
          where('questionData.level', '==', selectedLevel),
          where('questionData.lang', '==', selectedLanguage)
        )
      )
      querySnapshot.forEach((doc) => {
        const studentData = doc.data().questionData
        console.log(studentData)
      })

      const head = document.createElement('h3')
      head.textContent = `${selectedLanguage} ${selectedLevel} Questions`

      resultContainer.innerHTML = `<input id="back" type="submit" value="Back">
`
      resultContainer.appendChild(head)
      let index = 1

      querySnapshot.forEach((doc) => {
        const selectElement = document.createElement('select')

        const studentData = doc.data().questionData

        const questionText = document.createElement('h5')
        questionText.textContent = `Que ${index} : ${studentData.question}`

        const ansText = document.createElement('h5')
        ansText.textContent = `Answer : ${studentData.ans}`

        console.log('Que : ' + index)
        console.log(studentData.question)

        console.log('Option :')
        studentData.options.forEach((option) => {
          console.log(option)
          const optionElement = document.createElement('option')
          optionElement.value = option
          optionElement.textContent = option
          selectElement.appendChild(optionElement)
        })
        console.log('Append : ')
        const spam = document.createElement('div')
        spam.classList.add('spaceQue')

        resultContainer.appendChild(questionText)
        resultContainer.appendChild(selectElement)
        resultContainer.appendChild(ansText)
        resultContainer.appendChild(spam)

        index++
      })
    } catch (error) {
      console.log('Error ' + error)
    }

    document.getElementById('back').addEventListener('click', async (e) => {
      //None
      document.getElementById('slideid').style.display = 'none'
      document.getElementById('quizform').style.display = 'none'
      document.getElementById('result-container').style.display = 'none'
      document.getElementById('add-form').style.display = 'none'
      document.getElementById('question-container').style.display = 'none'
      document.getElementById('addlangform').style.display = 'none'
      document.getElementById('results-container').style.display = 'none'
      //Display
      document.getElementById('filterdata').style.display = 'block'
      const resultContainer = document.getElementById('allquestion-container')
      resultContainer.innerHTML = ''
      resultContainer.style.display = 'none'
    })
    // You may want to add logic to handle errors appropriately.
  })
