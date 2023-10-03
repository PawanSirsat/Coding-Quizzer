import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

// Your web app's Firebase configuration
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Reference the login form
const loginForm = document.getElementById('adminlogin-form')

// Add an event listener to the form for login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault() // Prevent the default form submission

  // Get user inputs
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    // User signed in successfully
    const user = userCredential.user
    console.log('User signed in:', user)
    document.getElementById('pop3').style.display = 'none'
    document.getElementById('feedback-cont2').style.display = 'none'
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
  } catch (error) {
    const feedbackContainer = document.getElementById('feedback-cont2')
    feedbackContainer.textContent = 'Worng credentials'
    feedbackContainer.classList.add('feedback', 'error')
    feedbackContainer.style.display = 'block'
    // Handle errors (e.g., wrong email or password)
    const errorCode = error.code
    const errorMessage = error.message
    console.error('Login error:', errorCode, errorMessage)
  }
})
