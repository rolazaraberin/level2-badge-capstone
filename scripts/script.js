$("#startButton").on("click", startRound);
$("#solveButton").on("click", solve);
$("#solveForm").on("submit", submitGuess);
$("#cancelButton").on("click", cancel);
$(document).on("keypress", pressEnterToStart);

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
function pressEnterToStart(event) {
  event.stopPropagation();
  let key = event.originalEvent.key;
  if (key == "Enter") startRound();
}
async function startRound() {
  hideStartButton();
  disablePressEnterToStart();
  showLoading();
  resetLetterSection();
  showLetterSection();
  resetMessageSection();
  await loadQuoteSection();
  hideLoading();
  showSolveButton();
  setScore();
  showScore();
  enableLetterPressGuesses();
  enableKeypressGuesses();
  isNotRoundOne = true;

  /**************************************
   * HELPER FUNCTIONS
   **************************************/
  function hideStartButton() {
    $("#startButton").addClass("d-none");
  }
  function showLetterSection() {
    $("#letterSection").hide();
    $("#letterSection").removeClass("d-none");
    $("#letterSection").show(1000);
  }
  function showScore() {
    $("#scoreSection").removeClass("d-none");
  }
  function setScore() {
    score = numberOfLetters(quote) * scoreMultiplier;
    $("#score").text(score);
  }
  function resetLetterSection() {
    let $letters = $("#letterSection button");
    $letters.attr("disabled", false);
  }
  function resetMessageSection() {
    outputMessage("", "clear");
  }
  function disablePressEnterToStart() {
    $(document).off("keypress", pressEnterToStart);
  }
}
async function loadQuoteSection() {
  if (isQuote()) {
    await animateHideQuoteSection();
    clearQuoteBlanks();
    clearQuoteText();
  }
  await getQuote();
  createBlanks();
  await showQuoteSection();

  /**********************************************
   * HELPER FUNCTIONS
   **********************************************/
  function isQuote() {
    return $("#quoteText").html() != "" || $("#quoteBlanks").html() != "";
  }
  function animateHideQuoteSection() {
    return new Promise(promiseFunction);

    function promiseFunction(resolve, _reject) {
      $("#quoteSection").hide(1000, resolve);
    }
  }
  function showQuoteSection() {
    $("#quoteSection").hide();
    $("#quoteSection").removeClass("d-none");
    $("#quoteBlanks").show();
    $("#quoteText").hide();
    return new Promise(animateShowQuoteSection);

    function animateShowQuoteSection(resolve, _reject) {
      $("#quoteSection").show(2000, resolve);
    }
  }
  function clearQuoteBlanks() {
    $("#quoteBlanks").empty();
  }
  function clearQuoteText() {
    $("#quoteText").empty();
  }
  async function getQuote() {
    let baseUrl = "https://api.quotable.io/random";
    let queryString = "?maxLength=100";
    let url = baseUrl + queryString;
    //let url = "randomQuote.json";
    let response = await jQuery.get(url);
    quote = response.content.trim();
    author = response.author;
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
async function endRound() {
  disableLetterPressGuesses();
  disableKeypressGuesses();
  setHighScore();
  hideLetterPressSection();
  await hideQuoteBlanks();
  showQuoteText();
  showStartButton();
  hideSolveButton();
  outputMessageSolved();

  /************************************
   * HELPER FUNCTIONS
   ************************************/
  function showStartButton() {
    $("#startButton").removeClass("d-none");
    enablePressEnterToStart();
  }
  function enablePressEnterToStart() {
    $(document).on("keypress", pressEnterToStart);
  }
  function hideQuoteBlanks() {
    return new Promise(hideQuoteBlanksPromise);

    function hideQuoteBlanksPromise(resolve, _reject) {
      $("#quoteBlanks").hide(1500, resolve);
    }
  }
  function showQuoteText() {
    $("#quoteText").html('"' + quote + '"');
    return new Promise(animateShowQuoteText);

    function animateShowQuoteText(resolve, _reject) {
      $("#quoteText").hide();
      $("#quoteText").show(2000, resolve);
    }
  }
  function hideLetterPressSection() {
    $("#letterSection").hide(1000);
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
function decrementScore(decrementMultiplier = 1) {
  score -= scoreMultiplier * decrementMultiplier;
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
  hideSolveButton();
  showCancelButton();
  showSolveBox();
  disableKeypressGuesses();
  disableLetterPressGuesses();
  enableKeypressFocus();

  /***************************************
   * HELPER FUNCTIONS
   ***************************************/
  function showCancelButton() {
    $("#cancelButton").removeClass("d-none");
  }
  function showSolveBox() {
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
  if (!guess) {
    hideSolveSection();
    return;
  }
  if (isGuessCorrect(guess)) {
    hideSolveSection();
    revealLettersInQuote();
    endRound();
  } else {
    decrementScore();
    outputMessageIncorrect();
  }

  /****************************************
   * HELPER FUNCTIONS
   ****************************************/
  function isGuessCorrect(guessString) {
    let simplifiedQuote = toLowerLettersOnly(quote);
    let simplifiedGuess = toLowerLettersOnly(guessString);
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
function showLoading() {
  $("#loading").removeClass("d-none");
}
function hideLoading() {
  $("#loading").addClass("d-none");
}
function createBlanks() {
  let $word = $(startNewWord());
  for (let character of quote) {
    if (isLetter(character)) {
      let $blank = createLetterBlank(character);
      $word.append($blank);
    } else {
      $word.append(character);
      if (character != "'") $word = $(startNewWord());
    }
  }
  if (isWordUnresolved($word)) {
    console.log("Quote is missing final punctuation");
    $("#quoteBlanks").append($word);
  }

  $("#author").html(author);

  /****************************************
   * HELPER FUNCTIONS
   ****************************************/
  function startNewWord() {
    let word = document.createElement("div");
    $("#quoteBlanks").append(word);
    return word;
  }
  function isWordUnresolved($wordElement) {
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
  return character.match(/[a-z]/i);
}
function guessedLetter(letter) {
  disableLetter(letter);
  let numberOfLettersFound = revealLettersInQuote(letter);
  if (numberOfLettersFound > 0) {
    outputMessageCorrect();
    decrementScore(numberOfLettersFound);
  } else {
    outputMessageIncorrect();
    decrementScore();
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
  let numberOfLettersFound = 0;
  let $blankLetters = $("#quoteBlanks .blankLetter");
  for (let blankLetter of $blankLetters) {
    if (letter == undefined || isMatch(blankLetter, letter)) {
      //If letter is undefined, reveal the whole quote
      revealLetter(blankLetter);
      revealAnimation(blankLetter);
      removeBlankStatus(blankLetter);
      numberOfLettersFound++;
    }
  }
  return numberOfLettersFound;

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
    let reveal = { backgroundColor: "rgba(0, 0, 0, 0)" };
    $(blankElement).animate(reveal);
  }
}
