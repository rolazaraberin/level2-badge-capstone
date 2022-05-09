$("#startButton").on("click", startRound);
$("#solveButton").on("click", solve);
$("#solveForm").on("submit", submitGuess);
$("#cancelButton").on("click", cancel);

/************************************************
 * GLOBAL VARIABLES
 ***********************************************/
var quote;
var author;
var guessCount;
var bestGuessCount;
var score;
var scoreMultiplier = 100;
var isNotRoundOne = false;

/************************************************
 * FUNCTIONS
 ***********************************************/
async function startRound() {
  showLoadingScreen();
  //await resetQuoteSection();
  resetQuoteSection();
  resetLetterSection();
  resetMessageSection();
  await getQuote();
  hideStartButton();
  showSolveButton();
  closeLoadingScreen();
  createBlanks();
  setScore();
  showScore();
  showQuoteSection();
  showLetterSection();
  enableLetterPressGuesses();
  enableKeypressGuesses();
  isNotRoundOne = true;

  /**************************************
   * HELPER FUNCTIONS
   **************************************/
  function hideStartButton() {
    $("#startButton").addClass("d-none");
  }
  function showQuoteSection() {
    console.log("showQuoteSection");
    $("#quoteSection").hide();
    $("#quoteSection").removeClass("d-none");
    $("#quoteSection").show(2000);
  }
  function showLetterSection() {
    $("#letterSection").hide();
    $("#letterSection").removeClass("d-none");
    $("#letterSection").fadeIn(1000);
  }
  function showScore() {
    $("#scoreSection").removeClass("d-none");
  }
  function setScore() {
    score = numberOfLetters(quote) * scoreMultiplier;
    $("#score").text(score);
  }
  //async function resetQuoteSection() {
  function resetQuoteSection() {
    console.log("resetQuoteSection");
    //if (isNotRoundOne) await $("#quote").hide(500, clearQuote);
    $("#quoteSection").hide();
    clearQuote();
  }
  function clearQuote() {
    console.log("clearQuote");
    $("#quote").html("");
  }
  function resetLetterSection() {
    let $letters = $("#letterSection button");
    $letters.attr("disabled", false);
  }
  function resetMessageSection() {
    //$("#messageArea").html("");
    outputMessage("", "clear");
  }
}
function enableLetterPressGuesses() {
  $("#letterSection button").on("click", pressedLetter);
}
function disableLetterPressGuesses() {
  $("#letterSection button").off("click", pressedLetter);
}
function enableKeypressGuesses() {
  $(document).on("keypress", pressedKey);
}
function disableKeypressGuesses() {
  $(document).off("keypress", pressedKey);
}
function showSolveButton() {
  $("#solveButton").removeClass("d-none");
}
function endRound() {
  disableLetterPressGuesses();
  //$("#letterSection button").off("click");
  disableKeypressGuesses();
  //$(document).off("keypress");
  setHighScore();
  showQuote();
  showStartButton();
  hideLetterPressSection();
  hideSolveButton();
  outputMessageSolved();

  /************************************
   * HELPER FUNCTIONS
   ************************************/
  function showStartButton() {
    $("#startButton").removeClass("d-none");
  }
  function showQuote() {
    $("#quote").hide(1500, showQuoteAsText);
  }
  function showQuoteAsText() {
    $("#quote").html('"' + quote + '"');
    $("#quote").show(2000);
  }
  function hideLetterPressSection() {
    $("#letterSection").fadeOut(1000);
  }
}
function hideSolveButton() {
  $("#solveButton").addClass("d-none");
}
function setHighScore() {
  let $highScore = $("#highScore");
  let highScore = $("#highScore").text();
  if (highScore < score) $highScore.text(score);
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
  //console.log("clicked solve");
  hideSolveButton();
  //changeSolveButtonToCancel();
  //showSubmitButton();
  showCancelButton();
  showSolveBox();
  disableKeypressGuesses();
  disableLetterPressGuesses();
  enableKeypressFocus();
  //enableEnterKeyToSubmit();

  /***************************************
   * HELPER FUNCTIONS
   ***************************************/
  function showCancelButton() {
    $("#cancelButton").removeClass("d-none");
  }
  function showSolveBox() {
    //console.log("displaying solve box");
    $("#solveBox").hide();
    $("#solveBox").removeClass("d-none");
    $("#solveBox").show(500);
    $("#guess").focus();
  }
  function enableKeypressFocus() {
    $(document).on("keypress", focusTextInput);
  }
}
function focusTextInput(event) {
  $("#guess").focus();
}
function cancel(event) {
  clearGuess();
  hideSolveBox();
  hideCancelButton();
  showSolveButton();
  disableKeypressFocus();
  enableKeypressGuesses();
  enableLetterPressGuesses();

  /**********************************
   * HELPER FUNCTIONS
   **********************************/
  function hideCancelButton() {
    $("#cancelButton").addClass("d-none");
  }
  function hideSolveBox() {
    //$("#solveBox").addClass("d-none");
    $("#solveBox").hide(500);
  }
  function clearGuess() {
    $("#guess").val("");
  }
  function disableKeypressFocus() {
    $(document).off("keypress", focusTextInput);
  }
}
function submitGuess(event) {
  event.preventDefault();
  event.stopPropagation();
  let guess = getGuess(event);
  //console.log("guess", guess);
  if (!guess) {
    hideSolveSection();
    return;
  }
  if (isGuessCorrect(guess)) {
    //console.log("guess is correct");
    hideSolveSection();
    revealLettersInQuote();
    //revealQuote();
    endRound();
    //outputMessageCorrect();
  } else {
    //console.log("guess is not correct");
    decrementScore();
    outputMessageIncorrect();
  }

  /****************************************
   * HELPER FUNCTIONS
   ****************************************/
  function isGuessCorrect(guessString) {
    //console.log("checking guess");
    let simplifiedQuote = toLowerLettersOnly(quote);
    //console.log("quote", simplifiedQuote);
    let simplifiedGuess = toLowerLettersOnly(guessString);
    //console.log("guess", simplifiedGuess);
    return simplifiedGuess == simplifiedQuote;
  }
  function toLowerLettersOnly(string) {
    let lettersOnly = "";
    for (let character of string) {
      if (isLetter(character)) {
        lettersOnly += character.toLowerCase();
      }
    }
    return lettersOnly;
  }
  function hideSolveSection() {
    $("#cancelButton").click();
  }
  function getGuess(event) {
    return event.target.guess.value.trim();
  }
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
  quote = response.content.trim();
  author = response.author;
}
async function createBlanks() {
  let $word = $(startNewWord());
  for (let character of quote) {
    //console.log(letter);
    //let $blank = createLetterBlank(character);
    if (isLetter(character)) {
      //console.log("character is a letter");
      let $blank = createLetterBlank(character);
      //$blank.hide();
      $word.append($blank);
      //await $blank.show(1000);
      //await showBlank($blank);
    } else {
      //console.log("character is a punctuation");
      //if (character == " ") character = "_";
      //$("#quote").append($word);
      $("#quote").append(character);
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
    $("#quote").append(word);
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
function guessedLetter(letter) {
  //incrementGuessCount();
  decrementScore();
  disableLetter(letter);
  let isLetterFound = revealLettersInQuote(letter);
  if (isLetterFound) {
    outputMessageCorrect();
  } else {
    outputMessageIncorrect();
    //console.log("letter not in quote");
  }
  if (isNoMoreBlanks()) endRound();

  /*******************************************
   * HELPER FUNCITONS
   *******************************************/
  function disableLetter(letter) {
    let $letterElement = $(`#letterSection button:contains(${letter})`);
    $letterElement.attr("disabled", true);
  }
  function isNoMoreBlanks() {
    $blanks = $("#quoteSection .blankLetter");
    return $blanks.length == 0;
  }
}
function pressedLetter(event) {
  event.stopPropagation();
  let letter = event.target.innerText;
  guessedLetter(letter);
}
function pressedKey(event) {
  //console.log("pressed", event);
  event.stopPropagation();
  let letter = event.originalEvent.key;
  guessedLetter(letter);
}
function outputMessage(message, effect, color) {
  let $messageArea = $("#messageArea");
  $messageArea.text(message);
  switch (effect) {
    case "flash":
      flash(color);
      break;
    case "highlight":
      highlight(color);
      break;
    case "clear":
      clearMessage();
      break;
  }

  /******************************************
   * HELPER FUNCTIONS
   ******************************************/
  function flash(colorString) {
    let originalColor = $("#messageSection").css("background-color");
    $messageArea.animate({ "background-color": colorString });
    $messageArea.animate({ "background-color": originalColor });
  }
  function highlight(colorString) {
    $messageArea.animate({ "background-color": colorString });
  }
  function clearMessage() {
    let clear = "rgba(0,0,0,0)";
    $messageArea.css({ "background-color": clear });
  }
}
function outputMessageCorrect() {
  outputMessage("Good guess!", "flash", "green");
}
function outputMessageIncorrect() {
  outputMessage("Guess again...", "flash", "red");
}
function outputMessageSolved() {
  outputMessage("You guessed the quote!", "highlight", "green");
}
function revealLettersInQuote(letter) {
  let isLetterFound = false;
  let $blankLetters = $("#quote .blankLetter");
  //console.log("blank letters", $blankLetters);
  for (let blankLetter of $blankLetters) {
    if (letter == undefined || isMatch(blankLetter, letter)) {
      //If letter is undefined, reveal the whole quote
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
    //let reveal = { backgroundColor: "rgba(0, 0, 0, 0)", color: "black" };
    let reveal = { backgroundColor: "rgba(0, 0, 0, 0)" };
    $(blankElement).animate(reveal);
  }
}
