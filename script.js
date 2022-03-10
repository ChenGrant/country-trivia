let countryResponse;
let countryData;

let getCountryData = async () => {
  try {
    countryResponse = await fetch("https://restcountries.com/v3.1/all");
    countryData = await countryResponse.json();
  } catch (err) {
    console.log("API ERROR");
  }
};

getCountryData();

let render = (name) => {
  for (const countryNum in countryData) {
    const currCountry = countryData[countryNum];
    let names = currCountry.altSpellings;
    names.push(currCountry.name.common);
    names.push(currCountry.name.official);
    names = names.map((element) => element.toLowerCase());
    if (names.includes(name)) {
      document.getElementById("found-country").innerHTML = currCountry.name.common;
      document.getElementById("not-found").style.display = "none";
      document.getElementById("found").style.display = "block";
      document
        .getElementById("more-info")
        .setAttribute(
          "href",
          "https://restcountries.com/v3.1/name/" +
            currCountry.name.common +
            "?fullText=true"
        );
      document.getElementById("country-flag").src = currCountry.flags.png;
      return;
    }
  }
  document.getElementById("not-found-country").innerHTML = name;
  document.getElementById("not-found").style.display = "block";
  document.getElementById("found").style.display = "none";
};

var form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  var country_name = document.getElementById("country_name").value;
  document.getElementById("country_name").value = "";
  render(country_name.toLowerCase());
});


function toggle_mobile_menu(){
  if (window.innerWidth<1100){
    var x = document.getElementById("nav_links");
    if (x.style.display == "flex") {
      x.style.display = "none";
    }
    else{
      x.style.display = "flex";
    }
  }
}

//removes nav_mobile_links upon screen resize to full screen
prev_width = window.innerWidth
curr_width = window.innerWidth
$(window).resize(function() {
  curr_width = window.innerWidth
  if (window.innerWidth>1100){
    var x = document.getElementById("nav_links");
    x.style.display = "flex";
  }
  if (curr_width<1100 && prev_width>=1100){
    var x = document.getElementById("nav_links");
    x.style.display = "none";
  }
  prev_width = window.innerWidth
});


