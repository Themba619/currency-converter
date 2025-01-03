async function getApiKey() {
  try {
    const response = await $.ajax({
      type: "GET",
      url: "http://localhost:8080/getApiKey",
    });
    return response; // This is your API key
  } catch (error) {
    console.log("Problem fetching the API key.");
    throw error;
  }
}

async function getMap() {
  let dictionary = {};
  try {
    const response = await $.ajax({
      type: "Get",
      url: "http://localhost:8080/getCurrency",
    });

    // store response in dictionary
    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        dictionary[key] = response[key];
      }
    }
    // console.log("success from getMap()");
    return dictionary;
  } catch (error) {
    console.log("Problem getting data");
    throw error;
  }
}

async function displayOptions() {
  html = "";
  let dictionary = await getMap();

  // Get the keys
  const keys = Object.keys(dictionary);

  // Sort into alphabetical order
  keys.sort();

  // Store in new dictionary
  const sortedDict = keys.reduce((cur, key) => {
    cur[key] = dictionary[key];
    return cur;
  }, {});

  for (var key in sortedDict) {
    html += "<option value=" + key + ">" + key + "</option>";
  }
  document.getElementById("currencySelector1").innerHTML = html;
  document.getElementById("currencySelector2").innerHTML = html;
}

function getValue() {
  var input = document.getElementById("inputNumber");
  return input.value;
}

let dictionary = {};
async function optionSelected() {
  const apiKey = await getApiKey();

  // Get the selected current element
  var dropDown1 = document.getElementById("currencySelector1");
  var dropDown2 = document.getElementById("currencySelector2");

  var convertedAnswer = 0;

  // Add event listener
  dropDown1.addEventListener("change", function () {
    // Save value selected by user
    var text1Value = dropDown1.options[dropDown1.selectedIndex].text;

    // Make new api call
    var newApiCall =
      "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + text1Value;
    const xhttpr = new XMLHttpRequest();
    xhttpr.open("GET", newApiCall, true);
    xhttpr.send();

    xhttpr.onload = () => {
      if ((xhttpr.status = 200)) {
        const response = JSON.parse(xhttpr.response);
        dictionary = response.conversion_rates;
      } else {
        console.log("Problem");
      }
    };

    try {
      xhttpr.open("GET", newApiCall, true);
      xhttpr.send();

      xhttpr.onload = () => {
        if ((xhttpr.status = 200)) {
          const response = JSON.parse(xhttpr.response);
          dictionary = response.conversion_rates;
        } else {
          console.log("Problem");
        }
      };
    } catch (error) {
      console.log(error);
    }
  });

  dropDown2.addEventListener("change", function () {
    var text2Value = dropDown2.options[dropDown2.selectedIndex].text;
    var userNumber = getValue();
    for (var key in dictionary) {
      if (key == text2Value) {
        convertedAnswer = userNumber * dictionary[key];
        console.log(convertedAnswer);
        document.getElementById("result").innerHTML =
          convertedAnswer.toFixed(2);
      }
    }
  });
}
