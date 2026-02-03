const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copmsg = document.querySelector("[data-copymsg]");
const copyButton = document.querySelector("[data-copyBtn]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
handlecheckBoxChnage();
setIndicator("rgb(0, 255, 13)");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumber() {
  return String(getRandomInteger(0, 9));
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbols() {
  const symbols = "!@#$%^&*()_+[]{}<>?";
  return symbols[getRandomInteger(0, symbols.length - 1)];
}

function calStrength() {
  const hasUppercase = uppercaseCheck.checked;
  const hasLowercase = lowercaseCheck.checked;
  const hasNumber = numbersCheck.checked;
  const hasSymbol = symbolsCheck.checked;

  if (
    hasUppercase &&
    hasLowercase &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 8
  ) {
    setIndicator("rgb(233, 30, 30)");
  } else if (
    (hasLowercase || hasUppercase) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("rgb(14, 220, 58)");
  } else {
    setIndicator("rgb(167, 187, 17)");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copmsg.innerText = "Copied";
  } catch (e) {
    copmsg.innerText = "Failed";
  }

  copmsg.classList.add("active");
  setTimeout(() => copmsg.classList.remove("active"), 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function handlecheckBoxChnage() {
  checkCount = 0;

  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckBoxChnage);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = Number(e.target.value);
  handleSlider();
});

copyButton.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  handlecheckBoxChnage();

  if (checkCount <= 0) return;

  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUppercase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbols);

  // compulsory
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    const randIndex = getRandomInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }

  // shuffle
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  calStrength();
});
