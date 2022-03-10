const path = new URL(window.location.href).search;
const mode = path.substring(path.indexOf("=") + 1);
const minNumberQuestions = 1;
const maxNumberQuestions = 50;
const numOptions = 5;
const countryModePairs = [];

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
  $(".mode").text(mode);
};

let initAvailableCountries = () => {
  availableCountries = countryModePairs.map((item) => item.name);
};

let initCountryModePairs = (data) => {
  for (const country in data) {
    const currCountry = data[country];
    if (currCountry[mode] === undefined) {
      continue;
    }

    let countryObject = {
      name: currCountry.name.common,
    };
    countryObject[mode] = currCountry[mode][0];

    countryModePairs.push(countryObject);
  }
};

let enterKeyInput = (ele) => {
  event.key === "Enter" && quizSubmit();
};

let validNumQuestions = (num) => {
  return minNumberQuestions <= num && num <= maxNumberQuestions;
};

let quizSubmit = () => {
  let inputNumQuestions = document.getElementById("num_questions").value;
  if (!validNumQuestions(inputNumQuestions)) {
    $(".error_message").css("display", "block");
    return;
  }
  $(".error_message").css("display", "none");
  numQuestions = inputNumQuestions;
  $(".quiz-config").css("display", "none");
  $(".quiz").css("display", "block");
  renderQuiz();
  renderQuestion();
};

let renderQuiz = () => {
  let completion = $(".completed");
  for (let i = 0; i < numQuestions; i++) {
    const icon = document.createElement("div");
    icon.textContent = i + 1;
    icon.classList.add("completion_number");
    completion.append(icon);
  }
};

let getCountryMode = (countryName) => {
  return countryModePairs.filter((country) => country.name === countryName)[0][
    mode
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
  for (let i = 1; i <= numOptions; i++) {
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
  answerOptionNum = getRandomInt(numOptions);
  answerMode = getCountryMode(answerCountry);
  renderOptions(answerCountry, answerMode, answerOptionNum);
  $(".question_number").text(currQuestionNum + ".");
  $(".actual_question").text("Which of the following is the " + mode + " of ");
  $(".question_country").text(answerCountry);
};


let user_answer = choice => {
	if (choice === answerOptionNum) {
		console.log("correct")
		renderQuestion();
	} else {
		console.log("wrong, correct answer is: " + answerMode);
	}
};

renderMode();
getData();
