let countryResponse;
let countryData;

let getCountryData = async () => {
  try {
    countryResponse = await fetch("https://restcountries.com/v3.1/all");
    countryData = await countryResponse.json();
  } catch (err) {
    console.log("error");
  }
};

getCountryData();

let render = (name) => {
  let country;
  let found = false;
  for (const countryNum in countryData) {
    const currCountry = countryData[countryNum];
    let names = currCountry.altSpellings;
    names.push(currCountry.name.common);
    names.push(currCountry.name.official);
    names = names.map((element) => element.toLowerCase());
    if (names.includes(name)) {
      console.log(currCountry);
      country = {
        name: currCountry.name.common,
        flag: currCountry.flags.png,
        currencies: currCountry.currencies,
        languages: currCountry.languages,
        "more info": currCountry,
      };
      found = true;
      break;
    }
  }
  if (!found) {
    document.getElementById("not-found-country").innerHTML = name;
    document.getElementById("not-found").style.display = "block";
  } else {
    console.log(country);
  }
};

var form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  var country_name = document.getElementById("country_name").value;
  document.getElementById("country_name").value = "";
  render(country_name);
});
