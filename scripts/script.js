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
//var unguessedLetters;

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
      $blank.addClass("btn-secondary blankLetter");
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
  let isLetterFound = revealLettersInQuote(letter);
  if (!isLetterFound) {
    outputMessage("Guess again", "flash", "red");
    //console.log("letter not in quote");
  }

  /*******************************************
   * HELPER FUNCITONS
   *******************************************/
  function incrementGuessCount() {
    let $guess = $("#guessCount");
    let guessCount = $guess.text();
    guessCount++;
    $guess.text(guessCount);
  }
  function disableLetter(letter) {
    let $letterElement = $(`#letterSection button:contains(${letter})`);
    $letterElement.attr("disabled", true);
  }
  /*
  function isLetterInQuote(letter) {
    //let $blanks = $("#quote .blank");
    let $blanks = $("#quote .blankLetter");
    for (let blank of $blanks) {
      if (letter == $(blank).attr("value").toLowerCase()) return true;
    }
    //let $letters = $blanks.each().attr("value");
    //console.log("blanks", $blanks);
    //console.log("letters", $letters);
    return false;
  }*/
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
function outputMessage(message, effect, color) {
  let $messageArea = $("#messageArea");
  $messageArea.text(message);
  switch (effect) {
    case "flash":
      let originalColor = $messageArea.css("background-color");
      $messageArea.animate({ "background-color": color });
      $messageArea.animate({ "background-color": originalColor });
      break;
    case "highlight":
      $messageArea.animate({ "background-color": color });
      break;
  }
}
function revealLettersInQuote(letter) {
  let $blankLetters = $("#quote .blankLetter");
  console.log("blank letters", $blankLetters);
  let isLetterFound = false;
  for (let blankLetter of $blankLetters) {
    if (isMatch(blankLetter, letter)) {
      revealLetter(blankLetter);
      doRevealAnimation(blankLetter);
      removeBlankStatus(blankLetter);
      isLetterFound = true;
    }
  }
  return isLetterFound;

  /*********************************************
   * HELPER FUNCTIONS
   *********************************************/

  function isMatch(blankElement, letter) {
    return letter.toLowerCase() == $(blankElement).attr("value").toLowerCase();
  }
  function revealLetter(blankElement) {
    let $blankElement = $(blankElement);
    let hiddenLetter = $blankElement.attr("value");
    $blankElement.text(hiddenLetter);
  }
  function removeBlankStatus(blankElement) {
    $(blankElement).removeAttr("value");
    $(blankElement).removeClass("blankLetter");
  }
  function doRevealAnimation(blankElement) {
    let reveal = { backgroundColor: "rgba(0, 0, 0, 0)", color: "black" };
    $(blankElement).animate(reveal);
  }
}
