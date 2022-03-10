const path = new URL(window.location.href).search;
const mode = path.substring(path.indexOf("=") + 1);
console.log(mode);
let numQuestions = 0;
const countryModePairs = [];
let currQuestionNum = 0;
const countriesUsed = [];
let available_index = [];
let answerIndex;
let answer;


let getData = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    $(".mode").text(mode);
		for (let i = 0; i < data.length; i++) {
			available_index.push(i);
		}
    for (const country in data) {
      const currCountry = data[country];
      if (currCountry[mode] === undefined) {
        continue;
      }
      countryModePairs.push([currCountry.name.common, currCountry[mode][0]]);
    }
  } catch (err) {
    console.log(err);
  }
};

function search(ele) {
  if (event.key === "Enter") {
    quizSubmit();
  }
}

function quizSubmit() {
  let questions = document.getElementById("num_questions").value;
  if (questions < 0 || 50 < questions) {
    $(".error_message").css("display", "block");
    return;
  }
  $(".error_message").css("display", "none");
  numQuestions = questions;
  $(".quiz-config").css("display", "none");
  $(".quiz").css("display", "block");
  renderQuiz();
  setQuestion();
}

let renderQuiz = () => {
  let completion = $(".completed");
  for (let i = 0; i < numQuestions; i++) {
    const icon = document.createElement("div");
    icon.textContent = i + 1;
    icon.classList.add("completion_number");
    completion.append(icon);
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let setQuestion = () => {
	currQuestionNum++;
  let index = Math.floor(Math.random() * available_index.length);
	answerIndex = index;
  let country = countryModePairs[index][0];
	countriesUsed.push([index, country]);
	available_index = available_index.filter(item => item != index);
  answer = getRandomInt(5);
  for (let i = 1; i <= 5; i++) {
    const option = $("#option" + i);
    if (answer === i) {
      option.text(countryModePairs[index][1]);
    } else {
			let random_index = Math.floor(Math.random() * available_index.length);
			option.text(countryModePairs[random_index][1]);
		}
  }
  $(".question_number").text(currQuestionNum+".");
  $(".actual_question").text("Which of the following is the " + mode + " of ");
  $(".question_country").text(country);
};

let user_answer = choice => {
	if (choice === answer) {
		console.log("correct")
		setQuestion();
	} else {
		console.log("wrong, correct answer is: " + countryModePairs[answerIndex][1]);
	}
}


getData();
