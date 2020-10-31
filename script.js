// DOM REFERENCEs
// Welcome Page
const userRegPage = document.querySelector("#userRegistration");
const usernameInput = document.querySelector("#userNameInput");
const numOfQuestions = document.querySelector("#numberOfQuestions");
const categorySelect = document.querySelector("#categorySelect");
const difficultySelect = document.querySelector("#difficultySelect");
const submitBtn = document.querySelector("#startBtn");
// Question page
const questionPage = document.querySelector("#question-page");
const greetingSpan = document.querySelector("#h3user");
const qNumberOfSpan = document.querySelector("#q-number");
const categorySpan = document.querySelector("#cat");
const difficultySpan = document.querySelector("#diff");
const nextBtn = document.querySelector("#next-q");
// Results page
const resultsPage = document.querySelector("#results-page");

// GLOBAL VARIABLES
let playerName;
let qNumber = 0;
let maxQNumber;
let userAnswer;
let questionSet;
let gameArray = [];

// EVENT LISTENERS
submitBtn.addEventListener("click", submitForm);
nextBtn.addEventListener("click", nextQuestion);
// FUNCTIONS

/* 
  HANDLE SUBMIT CLICK EVENT - SubmitForm(),
  GRAB VALUES FROM USER INPUTS - getFormData(),
  VALIDATE AND SET PLAYERNAME,
  BUILD THE API URL BASED ON SELECTIONS- buildURL(),
  SEND FECTCH WITH URL TO GET QUESTIONS -getQuestions().
*/
function submitForm() {
  const { username, number, category, difficulty } = getFormData();
  if (!username) {
    alert("Enter a username first!");
    return;
  }
  playerName = username;
  let url = buildURL(number, category, difficulty);
  getQuestions(url);
  changeScene(userRegPage, questionPage);
}

function getFormData() {
  let username = usernameInput.value;
  let number = numOfQuestions.value;
  maxQNumber = number;
  let category = categorySelect.value;
  let difficulty = difficultySelect.value;
  console.log(username, number, category, difficulty);

  return {
    username,
    number,
    category,
    difficulty,
  };
}

function buildURL(num, cat, diff) {
  let apiURL = `https://opentdb.com/api.php?amount=${num}`;
  if (cat !== "any") apiURL += `&category=${cat}`;
  if (diff !== "any") apiURL += `&difficulty=${diff}`;
  return apiURL;
}

async function getQuestions(url) {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
  questionSet = data.results;
  populateQuestion(questionSet);
}

/* 
PROCESS QUESTIONS OBJECT FROM FECTCH FUNCTION
CHANGE SCREEN TO QUESTION SCREEN
- POPULATE ELEMENTS AND QUESTION DATA PER QUESTION
EVENT FOR NEXT BUTTON.
*/

function changeScene(from, to) {
  from.style.display = "none";
  to.style.display = "block";
}

function populateWelcomeFields(category, difficulty) {
  greetingSpan.innerText = playerName;
  qNumberOfSpan.innerText = ` ${qNumberOfSpan.innerText.slice(0, 9)} ${
    qNumber + 1
  } of ${maxQNumber}`;
  categorySpan.innerText = `${categorySpan.innerText.slice(0, 10)} ${category}`;
  difficultySpan.innerText = `${difficultySpan.innerText.slice(
    0,
    11
  )} ${difficulty}`;
}

function populateQuestionBoxes(questionObj) {
  document.querySelector("#questionH3").innerText = `Question ${qNumber + 1}:`;
  document.querySelector("#question-text").innerHTML = questionObj.question;
  populateAnswerBoxes([
    questionObj.correct_answer,
    ...questionObj.incorrect_answers,
  ]);
}

function populateAnswerBoxes(arr) {
  // shuffle array contents
  for (let i = 0; i < arr.length; i++) {
    let btn = document.createElement("button");
    btn.innerText = arr[i];
    btn.setAttribute("data.text", arr[i]);
    btn.addEventListener("click", selectAnswer);
    const btnArea = document.querySelector("#ans-buttons");
    btnArea.appendChild(btn);

    nextBtn.classList.remove("selected");
    nextBtn.disabled = true;
  }

  /* const answerBtns = document.querySelector('#ans-buttons');
  let buttons = answerBtns.querySelectorAll('button');
  buttons = Array.from(buttons);
  buttons.forEach((btn, i) => {
    btn.innerText = arr[i];
    btn.setAttribute('data.text' , arr[i]);
    btn.addEventListener('click', selectAnswer);
    btn.style.display = 'block';
  }) */
}

function populateQuestion(qArray) {
  populateWelcomeFields(qArray[qNumber].category, qArray[qNumber].difficulty);
  populateQuestionBoxes(qArray[qNumber]);
}

function selectAnswer(e) {
  e.stopPropagation();
  userAnswer = e.target.attributes[0].value;
  e.target.classList.toggle("selected");
  document.querySelectorAll("div#ans-buttons button").forEach((btn) => {
    if (btn.attributes[0].value !== e.target.attributes[0].value) {
      btn.classList.remove("selected");
    }
  });
  nextBtn.classList.add("selected");
  nextBtn.disabled = false;
  console.log(userAnswer);
}

function nextQuestion() {
  if (qNumber < maxQNumber - 1) {
    gameArray.push({
      question: `${qNumber}`,
      userSelection: userAnswer,
      correct: questionSet[qNumber].correct_answer,
    });
    qNumber++;
    removeButtons();
    populateQuestion(questionSet);
  } else {
    // display end of game results
    questionPage.style.display = "none";
    resultsPage.style.display = "block";
    // populate game-config div

    // populate results area
    populateResultsArea();
  }
}

function removeButtons() {
  const answerBtns = document.querySelector("#ans-buttons");
  let buttons = answerBtns.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.removeEventListener("click", selectAnswer);
    btn.remove();
  });
}

function populateResultsArea() {
  const resultsObj = gameArray;
  resultsObj.forEach((obj) => {
    const { question, userSelection, correct } = obj;
    let div = document.createElement("div");
    let ul = document.createElement("div");
    let h3 = document.createElement("h3");
    h3.innerText = `Question: ${Number(question) + 1}`;
    let ansLi = document.createElement("li");
    ansLi.innerText = `Your Answer: ${userSelection}`;
    if (userSelection === correct) {
      ansLi.style.color = "green";
    } else {
      ansLi.style.color = "red";
    }
    let corrLi = document.createElement("li");
    corrLi.innerText = `Correct Answer: ${correct}`;
    ul.appendChild(ansLi);
    ul.appendChild(corrLi);
    div.appendChild(h3);
    div.appendChild(ul);
    document.querySelector("#results-area").appendChild(div);
  });
}

/* 
Todo:
reset fields to blank between questions
handle end of all questions.
Fades
spinners
result page
*/
