const path = new URL(window.location.href).search;
const mode = path.substring(path.indexOf("=") + 1);
console.log(mode);


const countryModePairs = new Map();
let getData = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    $(".mode").text(mode);
    for (const country in data) {
      const currCountry = data[country];
      if (currCountry[mode] === undefined) {
        continue;
      }
      countryModePairs[currCountry.name.common] = currCountry[mode][0];
    }
    console.log(countryModePairs);
    setQuestion();
  } catch (err) {
    console.log("API ERROR");
  }
};

getData();

let setQuestion = () => {

}

let numQuestions;
function quizSubmit() {
    let questions = document.getElementById("num_questions").value;
    if (questions < 0 || 50 < questions) {
        $(".error_message").css("display", "block");
        return
    }
    $(".error_message").css("display", "none");
    numQuestions = questions;
    console.log(numQuestions)
    
}

function search(ele) {
    if(event.key === 'Enter') {
        quizSubmit();        
    }
}