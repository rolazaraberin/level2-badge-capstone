$("#startButton").click(start);
$("#letterSection button").click(pressedLetter);
$(document).keypress(pressedKey);

/************************************************
 * GLOBAL VARIABLES
 ***********************************************/
var quote;
var author;
var guessCount;
var bestGuessCount;

/************************************************
 * FUNCTIONS
 ***********************************************/
async function start() {
  showLoadingScreen();
  await getQuote();
  closeLoadingScreen();
  createBlanks();
  showKeyboard();
}

async function showLoadingScreen() {
  console.log("loading...");
}
function closeLoadingScreen() {
  console.log("done loading...");
}
async function getQuote() {
  let baseUrl = "https://api.quotable.io/random";
  let queryString = "?maxLength=100";
  //let url = baseUrl + queryString;
  let url = "randomQuote.json";
  //jQuery.get(url, logResults);
  let response = await jQuery.get(url);
  //console.log("server response", response);
  quote = response.content;
  author = response.author;
}
function createBlanks() {
  let character;
  let word = document.createElement("div");
  let $word = $(word);
  for (character of quote) {
    //console.log(letter);
    let blank = document.createElement("div");
    let $blank = $(blank);
    $blank.addClass("col btn");
    if (isLetter(character)) {
      //console.log("character is a letter");
      $blank.attr("value", character);
      $blank.text("?");
      $blank.addClass("btn-secondary");
      $word.append($blank);
    } else {
      //console.log("character is a punctuation");
      //if (character == " ") character = "_";
      $("#quote").append($word);
      if (character != " ") {
        $blank.text(character);
        $("#quote").append($blank);
      }
      word = document.createElement("div");
      $word = $(word);
    }
  }
  if (isLetter(character)) {
    //Quote is missing final punctuation
    console.log("last character is a letter");
    $("#quote").append($word);
  }
  $("#author").html(author);
}
function isLetter(char) {
  //console.log("checking if letter");
  return char.match(/[a-z]/i);
}
function revealQuote() {
  console.log("revealing quote");
}
function showKeyboard() {
  $("#letterSection").removeClass("d-none");
}
function guessedLetter(letter) {
  incrementGuessCount();
  disableLetter(letter);
  let result = revealLetter(letter);
  if (!result) {
    outputMessage("Guess again");
    //console.log("letter not in quote");
  }

  function disableLetter(letter) {
    let $letterElement = $(`#letterSection button:contains(${letter})`);
    $letterElement.attr("disabled", true);
  }
}
function pressedLetter(event) {
  let letter = event.target.innerText;
  guessedLetter(letter);
}
function pressedKey(event) {
  //console.log("pressed", event);
  let letter = event.originalEvent.key;
  guessedLetter(letter);
}
function outputMessage(message) {
  $("#message").text(message);
}
function revealLetter(letter) {
  //console.log("revealing letter", letter);
  letter = letter.toLowerCase();
  let isLetterFound = false;
  let $blanks = $("#quote div[value]");
  let blank;
  for (blank of $blanks) {
    //console.log("blank", blank);
    let $blank = $(blank);
    let hiddenLetter = $blank.attr("value");
    if (letter == hiddenLetter.toLowerCase()) {
      isLetterFound = true;
      $blank.text(hiddenLetter);
      $blank.removeAttr("value");
      let colorNone = { backgroundColor: "rgba(0, 0, 0, 0)", color: "black" };
      $blank.animate(colorNone);
      //console.log("letter is found");
    }
    //console.log("hiddenLetter", hiddenLetter);
  }
  return isLetterFound;
}
function incrementGuessCount() {
  let $guess = $("#guessCount");
  let guessCount = $guess.text();
  guessCount++;
  $guess.text(guessCount);
}
