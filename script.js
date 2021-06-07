// pages
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
const gamePage = document.getElementById("game-page");
const resultPage = document.getElementById("results-page");

// splash-page elements
const form = document.querySelector("form");
const radioInputs = document.querySelectorAll(".radio-inputs");

// countdown elements
const countdown = document.getElementById("countdown");

// game-page elements
const gameContainer = document.getElementById("display-game");

// result-page elements
const baseTime = document.getElementById("base-time");
const penalityTime = document.getElementById("penality-time");
const finalTime = document.getElementById("final-time");
const playAgainBtn = document.getElementById("play-again");

// global-var
let numberOfQuestions = 0;
let setOfEquations = [];
let userChoice = [];
let result = {
  timePlayed: 0,
  penalityTime: 0,
};

let bestScores = {
  "10-question": "0.0",
  "25-question": "0.0",
  "50-question": "0.0",
  "99-question": "0.0",
};
const setBestScoreUtil = (el, key) =>
  (el.children[1].textContent = `${bestScores[key]}s`);

// set the selection on splash page
const resetSelection = (el) => (el.style.color = "black");
const activeSelection = (el) => (el.style.color = "red");
const displaySelection = () => {
  radioInputs.forEach((el) => {
    resetSelection(el);
    if (el.children[1].checked) {
      activeSelection(el);
    }
  });
};
// eventlistener - for splash page - selection
radioInputs.forEach((el) => {
  el.addEventListener("click", () => {
    numberOfQuestions = el.children[1].value;
    displaySelection();
  });
});

const startCountdown = () => {
  count = 2;
  counting = setInterval(() => {
    countdown.textContent = count;
    count--;
  }, 1000);
};
const stopCountdown = () => {
  setTimeout(() => {
    clearInterval(counting);
    countdown.textContent = "GO!";
  }, 3000);
};

const submitForm = (event) => {
  event.preventDefault();
  if (numberOfQuestions != 0) {
    splashPage.hidden = true;
    countdownPage.hidden = false;
    startCountdown();
    stopCountdown();
    setEquations();
  }
};

// listen for submit button
form.addEventListener("submit", (e) => submitForm(e));

// random number gen
const getRandom = (max) => Math.floor(Math.random() * max);

// select a operator
const getOperator = () => {
  const operator = ["add", "substract", "multiply", "divide"];
  return operator[getRandom(operator.length - 1)];
};

// create wrong equations
const makeMistake = (firstNumber, secondNumber, operator, solution) => {
  if (operator === "*") {
    return `${firstNumber}${operator}${secondNumber}=${solution + 1}`;
  }
  let option = getRandom(5);
  switch (option) {
    case 0:
      return `${firstNumber - 1}${operator}${secondNumber}=${solution}`;
    case 1:
      return `${firstNumber}${operator}${secondNumber - 1}=${solution}`;
    case 2:
      return `${firstNumber}${operator}${secondNumber}=${solution - 1}`;
    case 3:
      return `${firstNumber + 1}${operator}${secondNumber}=${solution}`;

    case 4:
      return `${firstNumber}${operator}${secondNumber + 1}=${solution}`;

    case 5:
      return `${firstNumber}${operator}${secondNumber}=${solution + 1}`;

    default:
      break;
  }
};
// returns an equation
const getEquations = (firstNumber, secondNumber, isCorrect) => {
  let equation;
  let solution;
  const choice = getOperator();
  switch (choice) {
    case "add":
      solution = firstNumber + secondNumber;
      equation = isCorrect
        ? `${firstNumber}+${secondNumber}=${solution}`
        : makeMistake(firstNumber, secondNumber, "+", solution);
      break;
    case "substract":
      solution = firstNumber - secondNumber;
      equation = isCorrect
        ? `${firstNumber}-${secondNumber}=${solution}`
        : makeMistake(firstNumber, secondNumber, "-", solution);
      break;
    case "multiply":
      solution = firstNumber * secondNumber;
      equation = isCorrect
        ? `${firstNumber}*${secondNumber}=${solution}`
        : makeMistake(firstNumber, secondNumber, "*", solution);
      break;
    case "divide":
      solution = secondNumber != 0 ? firstNumber / secondNumber : "No solution";
      equation = isCorrect
        ? `${firstNumber}/${secondNumber}=${solution}`
        : makeMistake(firstNumber, secondNumber, "/", solution);
      break;

    default:
      break;
  }

  return equation;
};

// add padding for scrolling purpose
const addPadding = (setEquations) => {
  let modifiedSetOfEquations = [];
  const totalQues = Number(numberOfQuestions) + 4;

  for (let i = 0; i < totalQues; i++) {
    if (i <= 1 || i > totalQues - 3) {
      modifiedSetOfEquations.push({
        equation: "padding",
        evaluation: undefined,
      });
    } else {
      modifiedSetOfEquations.push(setEquations[i - 2]);
    }
  }

  return modifiedSetOfEquations;
};
// update DOM
const populateQuestions = (equationSet) => {
  equationSet.forEach((obj) => {
    const item = document.createElement("div");
    item.classList.add("game-item");
    item.textContent = obj.equation === "padding" ? "" : obj.equation;

    gameContainer.appendChild(item);
  });
};

// display game page
const displayEquations = () => {
  gamePage.hidden = false;
  countdownPage.hidden = true;
  gameContainer.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// shuffle questions
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// load-up questions
const setEquations = () => {
  const correctEquations = getRandom(numberOfQuestions);
  const wrongEquations = numberOfQuestions - correctEquations;
  console.log("correct:", correctEquations, "wrong:", wrongEquations);

  for (let i = 0; i < correctEquations; i++) {
    let firstNumber = getRandom(9);
    let secondNumber = getRandom(9);

    let equation = getEquations(firstNumber, secondNumber, (isCorrect = true));
    setOfEquations.push({ equation: equation, evaluation: true });
  }
  for (let i = 0; i < wrongEquations; i++) {
    let firstNumber = getRandom(9);
    let secondNumber = getRandom(9);

    let equation = getEquations(firstNumber, secondNumber, (isCorrect = false));
    setOfEquations.push({ equation: equation, evaluation: false });
  }

  const shuffledQuestions = shuffle(setOfEquations);
  modifiedEquations = addPadding(shuffledQuestions);
  populateQuestions(modifiedEquations);
  setTimeout(() => displayEquations(), 4000);
};

// setup a timer to find the basetime
const gameTime = () => {
  result.timePlayed = 0;
  result.penalityTime = 0;
  basetime = setInterval(() => (result.timePlayed += 0.1), 100);
  gamePage.removeEventListener("click", gameTime);
};
// game-page click event listener
gamePage.addEventListener("click", gameTime);

// display-results
const displayFinalScore = () => {
  resultPage.hidden = false;
  gamePage.hidden = true;
  setTimeout(() => (playAgainBtn.hidden = false), 1000);
};

// evaluate the user performance
const evalUser = () => {
  console.log("user--", userChoice);
  clearInterval(basetime);
  setOfEquations.forEach((equation, index) => {
    if (equation.evaluation !== userChoice[index]) {
      result.penalityTime += 0.5;
    }
  });
  baseTime.textContent = `Base time:${result.timePlayed.toFixed(2)}s`;
  penalityTime.textContent = `Penality time:${result.penalityTime.toFixed(2)}s`;
  finalScore = (result.timePlayed + result.penalityTime).toFixed(2);
  finalTime.textContent = `${finalScore}s`;
  saveScore(finalScore);
  displayFinalScore();
};

// scroll to next question and create an array with user-answers
const select = (choice) => {
  scroll = 50;
  gameContainer.scrollBy({
    top: scroll,
    behavior: "smooth",
  });
  userChoice.push(choice);
  if (userChoice.length === setOfEquations.length) {
    evalUser();
  }
};

const resetGame = () => {
  resultPage.hidden = true;
  splashPage.hidden = false;
  result.penalityTime = 0;
  result.timePlayed = 0;
  userChoice = [];
  setOfEquations = [];
  numberOfQuestions = 0;
  radioInputs.forEach((el) => resetSelection(el));
  gamePage.addEventListener("click", gameTime);
};
// listen for play-again btn press
playAgainBtn.addEventListener("click", resetGame);

// set best-scores
const setBestScore = () => {
  radioInputs.forEach((el) =>
    setBestScoreUtil(el.children[2], el.children[1].getAttribute("id"))
  );
};

// create a new localstorage id store does not exist and update best-scores
const createLocalStore = () => {
  const scores = window.localStorage.getItem("best-scores");
  if (!scores) {
    window.localStorage.setItem("best-scores", JSON.stringify(bestScores));
  } else {
    bestScores = JSON.parse(scores);
    setBestScore();
  }
};

// save score to local store
const saveScore = (score) => {
  const key = `${numberOfQuestions}-question`;
  if (Number(bestScores[key]) === 0.0 || score < Number(bestScores[key])) {
    bestScores[key] = score;
  }
  setBestScore();
  window.localStorage.setItem("best-scores", JSON.stringify(bestScores));
};

// on-load
createLocalStore();
