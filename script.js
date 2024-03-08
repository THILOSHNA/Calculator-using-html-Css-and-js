document.addEventListener("DOMContentLoaded", function () {
  // popup script  //

  const overlay = document.getElementById("overlay");
  const closeButton = document.getElementById("closeButton");

  closeButton.addEventListener("click", function () {
    overlay.style.display = "none";
    document.getElementById("calculator").style.display = "block";
  });

  // calculator script //
  let historyDiv = document.querySelector(".history");
  let screen = document.querySelector(".screen");
  let buttons = document.querySelectorAll(".btn");
  let history = "";

  // adding eventlistner for buttons
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      handleButtonClick(button.innerText);
    });
  });

  // handling buttons click functionality
  function handleButtonClick(value) {
    if (value === "C") {
      clearAll();
    } else if (value === "DEL") {
      deleteLastChar();
    } else if (value === "=") {
      evaluateExpression();
    } else {
      appendToScreen(value);
    }
  }

  // clearAll function //
  function clearAll() {
    screen.textContent = "";
    history = "";
    updateHistory();
  }

  // update function//
  function updateHistory() {
    historyDiv.textContent = history;
  }

  // delect last character function //
  function deleteLastChar() {
    let currentText = screen.textContent;
    screen.textContent = currentText.slice(0, -1);
  }

  //  evaluating the EXpression //
  function evaluateExpression() {
    try {
      let expression = screen.textContent;
      let result = calculate(tokenize(expression));

      result = parseFloat(result.toFixed(6));

      history = expression + " = " + result;
      screen.textContent = result;
      updateHistory();
    } catch (error) {
      screen.textContent = "Error";
    }
  }

  function tokenize(s) {
    // Parse a calculation string into an array of numbers and operators
    const array = [];
    let token = "";
    for (const character of s) {
      if ("^*/+-".includes(character)) {
        if (token === "" && character === "-") {
          token = "-";
        } else {
          array.push(parseFloat(token), character);
          token = "";
        }
      } else {
        token += character;
      }
    }
    if (token !== "") {
      array.push(parseFloat(token));
    }
    return array;
  }

  function calculate(tokens) {
    // Perform a calculation expressed as an array of operators and numbers
    const operatorPrecedence = [
      { "^": (a, b) => Math.pow(a, b) },
      { "*": (a, b) => a * b, "/": (a, b) => a / b },
      { "+": (a, b) => a + b, "-": (a, b) => a - b },
    ];
    let operator;
    for (const operators of operatorPrecedence) {
      const newTokens = [];
      for (const token of tokens) {
        if (token in operators) {
          operator = operators[token];
        } else if (operator) {
          newTokens[newTokens.length - 1] = operator(
            newTokens[newTokens.length - 1],
            token
          );
          operator = null;
        } else {
          newTokens.push(token);
        }
      }
      tokens = newTokens;
    }
    if (tokens.length > 1) {
      console.log("Error: unable to resolve calculation");
      return tokens;
    } else {
      return tokens[0];
    }
  }

  //  adding values to the screen //
  function appendToScreen(value) {
    screen.textContent += value;
  }
});
