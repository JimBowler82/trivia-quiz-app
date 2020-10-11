// DOM REFERENCEs
const usernameInput = document.querySelector('#userNameInput');
const numOfQuestions = document.querySelector('#numberOfQuestions');
const categorySelect = document.querySelector('#categorySelect');
const difficultySelect = document.querySelector('#difficultySelect');
const submitBtn = document.querySelector('#startBtn');

// GLOBAL VARIABLES
let playerName;

// EVENT LISTENERS
submitBtn.addEventListener('click', submitForm);

// FUNCTIONS

/* 
  HANDLE SUBMIT CLICK EVENT - SubmitForm(),
  GRAB VALUES FROM USER INPUTS - getFormData(),
  VALIDATE AND SET PLAYERNAME,
  BUILD THE API URL BASED ON SELECTIONS- buildURL(),
  SEND FECTCH WITH URL TO GET QUESTIONS -getQuestions().
*/
function submitForm() {
  const {username, number, category, difficulty} = getFormData();
  if(!username) {
    alert('Enter a username first!');
    return;
  }
  playerName = username;
  let url = buildURL(number, category, difficulty);
  getQuestions(url);
}

function getFormData() {
  return {
    username: usernameInput.value,
    number: numOfQuestions.value,
    category: categorySelect.value,
    difficulty: difficultySelect.value
  }
}

function buildURL(num, cat, diff) {
  let apiURL = `https://opentdb.com/api.php?amount=${num}`;
  if(cat !== 'any') apiURL += `&category=${cat}`;
  if(diff !== 'any') apiURL += `&difficulty=${diff}`;
  return apiURL;
}

async function getQuestions(url) {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}

/* 
  PROCESS QUESTIONS OBJECT FROM FECTCH FUNCTION
  CHANGE SCREEN TO QUESTION SCREEN
  - POPULATE ELEMENTS AND QUESTION DATA PER QUESTION
  EVENT FOR NEXT BUTTON.
*/