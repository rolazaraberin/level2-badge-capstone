$("#startButton").click(start);
$("#keyboard button").click(guessedLetter);
$(document).keypress(pressedLetter);

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
  showQuote();
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
  let url = baseUrl + queryString;
  //jQuery.get(url, logResults);
  let response = await jQuery.get(url);
  console.log("server response", response);
  quote = response.content;
  author = response.author;
}
function showQuote() {
  $("#quote").html(quote);
  $("#author").html(author);
}
function showKeyboard() {
  $("#keyboard").removeClass("d-none");
}
function guessedLetter(event) {
  let letter = event.target.innerText;
  $(event.target).attr("disabled", true);
  revealLetter(letter);
  incrementGuessCount();
}
function pressedLetter(event) {
  //console.log("pressed", event);
  let letter = event.originalEvent.key;
  let $target = $(`#keyboard button:contains(${letter})`);
  //console.log("target", target);
  $target.attr("disabled", true);
  revealLetter(letter);
  incrementGuessCount();
}
function revealLetter(letter) {
  console.log("revealing letter", letter);
}
function incrementGuessCount() {
  let $guess = $("#guessCount");
  let guessCount = $guess.text() || 0;
  guessCount++;
  $guess.text(guessCount);
}
