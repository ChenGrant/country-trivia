const PATH = new URL(window.location.href).search;
const MODE = PATH.substring(PATH.indexOf("=") + 1);
const CAPITAL = "capital";
const FLAG = "flag";
const CURRENCY = "currency";
const LANGUAGE = "language";
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
let rendering = false;

let getData = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    console.log(data);
    initCountryModePairs(data);
    initAvailableCountries();
  } catch (err) {
    console.log(err);
  }
};

let updateQuestionCompletion = (response) => {
  questionCompletion[questionCompletion.indexOf(INCOMPLETE)] = response;
};

let initAvailableCountries = () => {
  availableCountries = countryModePairs.map((item) => item.name);
};

let initCountryModePairs = (data) => {
  let field = MODE;
  if (MODE === FLAG || MODE == LANGUAGE) {
    field = MODE + "s";
  } else if (MODE === CURRENCY) {
    field = "currencies";
  }
  for (const country in data) {
    const currCountry = data[country];
    if (currCountry[field] === undefined) {
      continue;
    }

    let countryObject = {
      name: currCountry.name.common,
    };

    if (MODE === CAPITAL) {
      countryObject[MODE] = currCountry[field][0];
    } else if (MODE === FLAG) {
      countryObject[MODE] = currCountry[field].png;
    } else if (MODE === CURRENCY) {
      let str = Object.values(currCountry[field])
        .sort()
        .reduce((prev, curr) => {
          return prev + curr.name + ", ";
        }, "");
      countryObject[MODE] = str.substring(0, str.length - 2);
    } else if (MODE === LANGUAGE) {
      let str = Object.values(currCountry[field])
        .sort()
        .reduce((prev, curr) => {
          return prev + curr + ", ";
        }, "");
      countryObject[MODE] = str.substring(0, str.length - 2);
    }
    countryModePairs.push(countryObject);
  }
  // remove countries that are too long
  console.log(countryModePairs);
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
  if (MODE === CAPITAL) {
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
  } else {
    let tempAvailableCountries = availableCountries;
    for (let i = 1; i <= NUM_OPTIONS; i++) {
      const toRemove = document.querySelector(".flag_img");
      if (toRemove === null) {
        continue;
      }
      toRemove.remove();
    }
    for (let i = 1; i <= NUM_OPTIONS; i++) {
      const option = $("#option" + i);
      const image = document.createElement("img");
      if (answerOptionNum === i) {
        image.src = answerMode;
        image.classList.add("flag_img");
        option.append(image);
        continue;
      }
      const randomIndex = getRandomIndex(tempAvailableCountries);
      const randomCountryName = tempAvailableCountries[randomIndex];
      tempAvailableCountries = removeCountry(
        tempAvailableCountries,
        randomCountryName
      );
      const randomCountryMode = getCountryMode(randomCountryName);
      image.src = randomCountryMode;
      image.classList.add("flag_img");
      option.append(image);
    }
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

let renderQuestion = () => {
  if (countryModePairs.length === 0) {
    setTimeout(renderQuestion, 100);
    $(".actual_question").text("Loading...");
    return;
  }
  let index = getRandomIndex(availableCountries);
  answerCountry = availableCountries[index];
  availableCountries = removeCountry(availableCountries, answerCountry);
  answerOptionNum = getRandomInt(NUM_OPTIONS);
  currQuestionNum++;
  answerMode = getCountryMode(answerCountry);
  renderOptions(answerCountry, answerMode, answerOptionNum);
  $(".question_number").text(currQuestionNum + ".");
  $(".actual_question").text("Which of the following is the " + MODE + " of ");
  $(".question_country").text(answerCountry + "?");
};

let removeQuestions = () => {
  $(".question").css("display", "none");
};

let removeOptions = () => {
  $(".options").css("display", "none");
};

let renderScore = () => {
  $(".score").css("display", "flex");
  console.log(questionCompletion);
  const numCorrect = questionCompletion.reduce((prev, current) => {
    if (current === CORRECT) {
      return prev + 1;
    } else {
      return prev;
    }
  }, 0);
  const str = numCorrect + "/" + numQuestions;
  $(".score_num").text(str);
};

let highlightCorrect = () => {
  $("#button" + answerOptionNum).addClass("correct");
};

let highlightIncorrect = (num) => {
  $("#button" + num).addClass("incorrect");
};

let removeHighlight = () => {
  for (let i = 1; i <= NUM_OPTIONS; i++) {
    $("#button" + i).removeClass("correct");
    $("#button" + i).removeClass("incorrect");
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let user_answer = async (choice) => {
  if (rendering) {
    return;
  }
  rendering = true;
  if (choice === answerOptionNum) {
    console.log("correct, the answer is " + answerMode);
    updateQuestionCompletion(CORRECT);
  } else {
    console.log("wrong, correct answer is: " + answerMode);
    updateQuestionCompletion(INCORRECT);
    highlightIncorrect(choice);
  }
  highlightCorrect();
  await sleep(400);
  if (numQuestions != currQuestionNum) {
    removeHighlight();
    renderQuestion();
  } else {
    removeQuestions();
    removeOptions();
    renderScore();
  }
  console.log(questionCompletion);
  updateCompletion();
  rendering = false;
};

let renderMode = () => {
  if (MODE === CAPITAL) {
    $(".game_mode").text("capitals");
  } else if (MODE === FLAG) {
    $(".game_mode").text("flags");
  } else if (MODE === CURRENCY) {
    $(".game_mode").text("currencies");
  } else if (MODE === LANGUAGE) {
    $(".game_mode").text("languages");
  }
};

getData();
renderMode();