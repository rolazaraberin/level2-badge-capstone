bindClickEventsToDropdownMenu();

//Global variable
var activeLink;
setActiveLink($("#menu a:first"));

function bindClickEventsToDropdownMenu() {
  let $dropdownLinks = $("#skillsMenu a.dropdown-item");
  $dropdownLinks.on("click", loadLink);
}
function setActiveLink(newActiveElement) {
  if (activeLink) {
    $(activeLink).removeClass("active");
  }
  $(newActiveElement).addClass("active");
  activeLink = newActiveElement;
}
function loadLink(event) {
  event.preventDefault();
  let aTag = event.target;
  let link = aTag.href;
  jQuery.get(link, replaceSections);
  setActiveLink(aTag);

  function replaceSections(htmlData, _status, _jqXHR) {
    let $htmlData = $(htmlData);

    let $mainSectionNew = $htmlData.filter("main");
    let $mainSectionOld = $("main");
    replaceSection($mainSectionOld, $mainSectionNew);

    let $footerSectionNew = $htmlData.filter("body > footer");
    let $footerSectionOld = $("body > footer");
    replaceSection($footerSectionOld, $footerSectionNew);
  }
  function replaceSection($oldSection, $newSection) {
    $parentSection = $("body");
    $oldSection.remove();
    $newSection.appendTo($parentSection);
  }
}

/***********************************
 * OLD STUFF
 ************************************/

/*DEPRECATED - Append sections runs their script
  function runScript(_index, element) {
    //To run inserted scripts
    //1. Create a new script element with the code
    //2. Insert the script into the html document
    //    -This runs the script
    //3. OPTIONAL: Remove script

    let code = element.innerHTML;
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = code;
    let $head = $("head");
    $head.prepend(script);
    $(script).remove();
  }*/

/*
$.getScript("skill1-jquery-object.js")
  .done(() => console.log("1"))
  .fail(() => console.log("fail1"));
$.getScript("skill2-jquery-selectors.js", () => console.log("2"));
$.getScript("skill3-element-collections.js", () => console.log("3"));
*/

/*
var scripts = [
  "skill1-jquery-object.js",
  "skill2-jquery-selectors.js",
  "skill3-element-collections.js",
];

loadScripts(scripts);
//NOTE: This is not working because scripts don't get executed
//NOTE: For now, manually load them in HTML 
*/
//buildOutput("OUTPUT:");

//var sections = [
/*{
    title: "Skill 2",
    subtitle: "jQuery Selectors",
    buttons: [
      { name: "ID selector", function: exampleJqueryIdSelector },
      { name: "Class selector", function: exampleJqueryClassSelector },
      { name: "Element selector", function: exampleJqueryElementSelector },
      { name: "Attribute selector", function: exampleJqueryAttributeSelector },
      { name: "Nested selector", function: exampleJqueryNestedSelector },
      { name: "Children combinator", function: exampleJqueryCombinator },
      { name: "Pseudo class", function: exampleJqueryPseudoSelector },
      { name: "Jquery pseudo element*", function: exampleJqueryFirstLine },
      { name: ":first", function: exampleJqueryFirstSelector },
      //{ name: "Index selector", function: exampleIndexSelector },
      { name: "Index less than", function: exampleLesserIndex },
      { name: "Index greater", function: exampleGreaterIndex },
      //{ name: ":even", function: exampleEvenIndex },
      //{ name: ":odd", function: exampleOddIndex },
      { name: ":header", function: examplejQueryHeader },
      { name: ":animated*", function: examplejQueryAnimated },
      { name: ':contains("text")', function: examplejQueryContains },
      { name: ':has("selector")', function: examplejQueryHas },
      { name: ":parent", function: examplejQueryParent },
      { name: ":hidden*", function: examplejQueryHidden },
      { name: ":visible*", function: examplejQueryVisible },
    ],
  },*/
/*
  {
    title: "Skill 3",
    subtitle: "Element Collections",
    buttons: [
      { name: ".each(callback)", function: jqueryEachTitle },
      { name: "Index selector", function: exampleJqueryIndex },
      { name: "Index even", function: exampleEvenIndex },
      { name: "Index odd", function: exampleOddIndex },
      { name: ".next()", function: exampleJqueryNext },
      { name: ".prev()", function: exampleJqueryPrev },
      { name: '.filter("selector")', function: exampleJqueryFilter },
      { name: ".filter(callback)", function: exampleJqueryFilterCallback },
    ],
  },*/
/*{
    title: "Skill 4",
    subtitle: "DOM Events",
    buttons: [{ name: "example 1", function: {} }],
  },*/
/*
  {
    title: "Skill 5",
    subtitle: "DOM Elements",
    buttons: [{ name: "example 1", function: {} }],
  },
  {
    title: "Skill 6",
    subtitle: "",
    buttons: [{ name: "example 1", function: {} }],
  },
  {
    title: "Skill 7",
    subtitle: "",
    buttons: [{ name: "example 1", function: {} }],
  },
  {
    title: "Skill 8",
    subtitle: "",
    buttons: [{ name: "example 1", function: {} }],
  },
  {
    title: "Skill 9",
    subtitle: "",
    buttons: [{ name: "example 1", function: {} }],
  },
];*/

//buildSections(sections);

/****************************************************
 FUNCTIONS
*****************************************************/

/*DEPRECATED - build the output section in HTML with Boostrap classes
function buildOutput(headingString) {
  let outputHeading = document.getElementById("outputHeading");
  let clearOutputButton = {};
  clearOutputButton.name = "Clear output";
  clearOutputButton.function = () => clearOutput(headingString);
  let clearOutputButtonElement = buildButton(clearOutputButton);
  outputSection.appendChild(clearOutputButtonElement);
  output(headingString);
}*/
/*DEPRECATED: Moved to EXAMPLES.JS
function output(string) {
  let outputSection = document.getElementById("output");
  let divTag = document.createElement("div");
  divTag.innerHTML = string;
  outputSection.appendChild(divTag);
}*/
/*DEPRECATED: Moved to EXAMPLES.JS
function clearOutput(headingString) {
  let output = document.getElementById("output");
  output.innerHTML = "";
  console.clear();
  //output(headingString);
}*/
/* DEPRECATED - build scripts in HTML or link JavaScript file
function loadScripts(scriptFileStrings) {
  let headElement = document.getElementById("head");

  let scriptFile = "";
  for (scriptFile of scriptFileStrings) {
    let scriptElement = buildScript(scriptFile);
    headElement.appendChild(scriptElement);
  }
}*/
/* DEPRECATED - build scripts in HTML or JavaScript file
function buildScript(scriptFileString) {
  let scriptElement = document.createElement("script");
  scriptElement.type = "text/javascript";
  scriptElement.src = scriptFileString;
  //scriptElement.setAttribute("defer");
  return scriptElement;
}*/
/* DEPRECATED - build sections in HTML with Bootstrap classes
function buildSections(sectionObjects) {
  let examplesElement = document.getElementById("examples");
  let sectionObject = {};

  for (sectionObject of sectionObjects) {
    let sectionElement = buildSection(sectionObject);
    let divider = document.createElement("hr");
    sectionElement.appendChild(divider);
    examplesElement.appendChild(sectionElement);
  }
}*/
/* DEPRECATED - build sections in HTML with Bootstrap classes
function buildSection(sectionObject) {
  let sectionElement = document.createElement("section");

  let title = buildTitle(sectionObject.title);
  sectionElement.appendChild(title);

  let subtitle = buildSubtitle(sectionObject.subtitle);
  sectionElement.appendChild(subtitle);

  let buttons = buildButtons(sectionObject.buttons);
  //sectionElement.append(buttons);

  let button = {};
  //buttons.forEach(sectionElement.appendChild);

  for (button of buttons) {
    let br = document.createElement("br");
    sectionElement.appendChild(button);
    sectionElement.appendChild(br);
  }

  return sectionElement;
}*/
/* DEPRECATED - build title in HTML with Bootstrap classes
function buildTitle(titleString) {
  let titleElement = document.createElement("h1");
  titleElement.innerHTML = titleString;
  titleElement.className = "title";
  return titleElement;
}*/
/* DEPRECATED - build subtitle in HTML with Bootstrap classes
function buildSubtitle(subtitleString) {
  let subtitleElement = document.createElement("h3");
  subtitleElement.innerHTML = subtitleString;
  subtitleElement.className = "subtitle";
  return subtitleElement;
}*/
/* DEPRECATED - build buttons in HTML with Bootstrap classes
function buildButtons(buttonObjects) {
  let buttonObject = {};
  let buttonElements = [];

  for (buttonObject of buttonObjects) {
    let buttonElement = buildButton(buttonObject);
    buttonElements.push(buttonElement);
  }

  return buttonElements;
}*/
/* DEPRECATED - build buttons in HTML with Bootstrap classes
function buildButton(buttonObject) {
  let buttonElement = document.createElement("input");
  buttonElement.type = "button";
  buttonElement.value = buttonObject.name;
  buttonElement.onclick = buttonObject.function;
  return buttonElement;
}*/
