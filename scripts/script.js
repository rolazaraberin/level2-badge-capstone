$("#startButton").click(start);
$("#solveButton").click(solve);
$("#letterSection button").click(pressedLetter);
$(document).keypress(pressedKey);

/************************************************
 * GLOBAL VARIABLES
 ***********************************************/
var quote;
var author;
var guessCount;
var bestGuessCount;
var score;
var scoreMultiplier = 100;

/************************************************
 * FUNCTIONS
 ***********************************************/
async function start() {
  showLoadingScreen();
  await getQuote();
  hideStartButton();
  showSolveButton();
  closeLoadingScreen();
  createBlanks();
  setScore();
  showScore();
  showQuoteSection();
  showLetterSection();

  /**************************************
   * HELPER FUNCTIONS
   **************************************/
  function hideStartButton() {
    $("#startButton").addClass("d-none");
  }
  function showSolveButton() {
    $("#solveButton").removeClass("d-none");
  }
  function showQuoteSection() {
    $("#quoteSection").removeClass("d-none");
  }
  function showScore() {
    $("#scoreSection").removeClass("d-none");
  }
}
function setScore() {
  score = numberOfLetters(quote) * scoreMultiplier;
  $("#score").text(score);
}
function decrementScore() {
  score -= scoreMultiplier;
  $("#score").text(score);
}
function numberOfLetters(string) {
  let letterCount = 0;
  for (let character of string) {
    if (isLetter(character)) letterCount++;
  }
  return letterCount;
}
function solve() {
  console.log("clicked solve");
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
  let $word = $(startNewWord());
  for (let character of quote) {
    //console.log(letter);
    //let $blank = createLetterBlank(character);
    if (isLetter(character)) {
      //console.log("character is a letter");
      let $blank = createLetterBlank(character);
      // $blank.attr("value", character);
      // $blank.text("?");
      // $blank.addClass("btn-secondary blankLetter");
      $word.append($blank);
    } else {
      //console.log("character is a punctuation");
      //if (character == " ") character = "_";
      $("#quote").append($word);
      $("#quote").append(character);
      // if (character != " ") {
      //   $blank.text(character);
      //   $("#quote").append($blank);
      // }
      //word = document.createElement("div");
      //$word = $(word);
      $word = $(startNewWord());
    }
  }
  if (isWordUnresolved($word)) {
    console.log("Quote is missing final punctuation");
    $("#quote").append($word);
  }
  $("#author").html(author);

  /****************************************
   * HELPER FUNCTIONS
   ****************************************/
  function startNewWord() {
    let word = document.createElement("div");
    return word;
  }
  function isWordUnresolved($wordElement) {
    //console.log("text", $wordElement.text() == "");
    return $wordElement.text() != "";
  }
  function createLetterBlank(letter) {
    let blank = document.createElement("div");
    let $blank = $(blank);
    $blank.addClass("col btn btn-secondary blankLetter");
    $blank.attr("value", letter);
    $blank.text("?");
    return $blank;
  }
}
function isLetter(character) {
  //console.log("checking if letter");
  return character.match(/[a-z]/i);
}
function revealQuote() {
  console.log("revealing quote");
}
function showLetterSection() {
  $("#letterSection").removeClass("d-none");
}
function guessedLetter(letter) {
  //incrementGuessCount();
  decrementScore();
  disableLetter(letter);
  let isLetterFound = revealLettersInQuote(letter);
  if (isLetterFound) {
    outputMessage("Good guess!", "flash", "green");
  } else {
    outputMessage("Guess again", "flash", "red");
    //console.log("letter not in quote");
  }

  /*******************************************
   * HELPER FUNCITONS
   *******************************************/
  /*function incrementGuessCount() {
    let $guess = $("#guessCount");
    let guessCount = $guess.text();
    guessCount++;
    $guess.text(guessCount);
  }*/
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
function outputMessage(message, effect, color) {
  let $messageArea = $("#messageArea");
  $messageArea.text(message);
  switch (effect) {
    case "flash":
      let originalColor = $("#messageSection").css("background-color");
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
  //console.log("blank letters", $blankLetters);
  let isLetterFound = false;
  for (let blankLetter of $blankLetters) {
    if (isMatch(blankLetter, letter)) {
      revealLetter(blankLetter);
      revealAnimation(blankLetter);
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
  function revealAnimation(blankElement) {
    let reveal = { backgroundColor: "rgba(0, 0, 0, 0)", color: "black" };
    $(blankElement).animate(reveal);
  }
}
