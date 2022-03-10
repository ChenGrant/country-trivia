const PATH = new URL(window.location.href).search;
const MODE = PATH.substring(PATH.indexOf("=") + 1);
const MIN_NUM_QUESTIONS = 1;
const MAX_NUM_QUESTIONS = 50;
const NUM_OPTIONS = 5;
const CORRECT = "correct";
const INCORRECT = "incorrect";
const INCOMPLETE = "";
const CHECK_MARK = "&#10003;";
const X_MARK = "&#10005;";
const countryModePairs = [];

let questionCompletion = [];

let numQuestions = 0;
let currQuestionNum = 0;
let availableCountries = [];

let answerCountry;
let answerMode;
let answerOptionNum;

let getData = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    initCountryModePairs(data);
    initAvailableCountries();
  } catch (err) {
    console.log(err);
  }
};

let renderMode = () => {
  $(".mode").text(MODE);
};

let updateQuestionCompletion = (response) => {
  questionCompletion[questionCompletion.indexOf(INCOMPLETE)] = response;
};

let initAvailableCountries = () => {
  availableCountries = countryModePairs.map((item) => item.name);
};

let initCountryModePairs = (data) => {
  for (const country in data) {
    const currCountry = data[country];
    if (currCountry[MODE] === undefined) {
      continue;
    }

    let countryObject = {
      name: currCountry.name.common,
    };
    countryObject[MODE] = currCountry[MODE][0];

    countryModePairs.push(countryObject);
  }
};

let enterKeyInput = (ele) => {
  event.key === "Enter" && quizSubmit();
};

let validNumQuestions = (num) => {
  return MIN_NUM_QUESTIONS <= num && num <= MAX_NUM_QUESTIONS;
};

let initQuestionCompletion = () => {
  for (let i = 0; i < numQuestions; i++) {
    questionCompletion.push(INCOMPLETE);
  }
  console.log(questionCompletion);
};

let quizSubmit = () => {
  let inputNumQuestions = document.getElementById("num_questions").value;
  if (!validNumQuestions(inputNumQuestions)) {
    $(".error_message").css("display", "block");
    return;
  }
  $(".error_message").css("display", "none");
  numQuestions = inputNumQuestions;
  initQuestionCompletion();
  $(".quiz-config").css("display", "none");
  $(".quiz").css("display", "block");
  renderCompletion();
  renderQuestion();
};

let renderCompletion = () => {
  let completionElement = $(".completed");
  console.log(questionCompletion);
  for (let i = 0; i < numQuestions; i++) {
    const icon = document.createElement("div");
    icon.textContent = i + 1;
    icon.classList.add("completion_number");
    completionElement.append(icon);
  }
};

let updateCompletion = () => {
  let icons = Array.from(document.querySelector(".completed").children);
  for (let i = 0; i < numQuestions; i++) {
    const icon = icons[i];
    if (questionCompletion[i] === CORRECT) {
      icon.innerHTML = CHECK_MARK;
      icon.classList.add("check_mark");
    } else if (questionCompletion[i] === INCORRECT) {
      icon.innerHTML = X_MARK;
      icon.classList.add("x_mark");
    } else {
      icon.textContent = i + 1;
    }
  }
};

let getCountryMode = (countryName) => {
  return countryModePairs.filter((country) => country.name === countryName)[0][
    MODE
  ];
};

let getRandomIndex = (iterable) => {
  return Math.floor(Math.random() * iterable.length);
};

let removeCountry = (countries, name) => {
  return countries.filter((item) => item != name);
};

let renderOptions = (answerCountry, answerMode, answerOptionNum) => {
  let tempAvailableCountries = availableCountries;
  for (let i = 1; i <= NUM_OPTIONS; i++) {
    const option = $("#option" + i);
    if (answerOptionNum === i) {
      option.text(answerMode);
      continue;
    }
    const randomIndex = getRandomIndex(tempAvailableCountries);
    const randomCountryName = tempAvailableCountries[randomIndex];
    tempAvailableCountries = removeCountry(
      tempAvailableCountries,
      randomCountryName
    );
    const randomCountryMode = getCountryMode(randomCountryName);
    option.text(randomCountryMode);
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

let renderQuestion = () => {
  currQuestionNum++;
  let index = getRandomIndex(availableCountries);
  answerCountry = availableCountries[index];
  availableCountries = removeCountry(availableCountries, answerCountry);
  answerOptionNum = getRandomInt(NUM_OPTIONS);
  answerMode = getCountryMode(answerCountry);
  renderOptions(answerCountry, answerMode, answerOptionNum);
  $(".question_number").text(currQuestionNum + ".");
  $(".actual_question").text("Which of the following is the " + MODE + " of ");
  $(".question_country").text(answerCountry);
};

let user_answer = (choice) => {
  if (choice === answerOptionNum) {
    console.log("correct");
    updateQuestionCompletion(CORRECT);
  } else {
    console.log("wrong, correct answer is: " + answerMode);
    updateQuestionCompletion(INCORRECT);
  }
  renderQuestion();
  updateCompletion();
};

renderMode();
getData();
