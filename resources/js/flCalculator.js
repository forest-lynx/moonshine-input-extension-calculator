export default (el) => ({
  el: el,
  input: null,
  calculatorShow: false,
  formula: "",
  displayField: null,
  allowedKeys: "0123456789+-*/(),.%^",
  operators: "+-*/%^",

  //TODO добавить логику при работе с полем number min max step
  //TODO обработка локали для корректного вывода чисел
  init() {
    this.input = el.querySelector("input");
    this.displayField = el.querySelector(".calculator input.formula");
    this.el.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.calculatorShow = false;
  },

  toggle() {
    this.calculatorShow = !this.calculatorShow;

    if (this.calculatorShow) {
      this.formula = this.input.value
        ? this.input.value.replace(/\s/g, "")
        : this.formula;
      this.setDisplayFormula();
    } else {
      this.input.value = this.calculate(this.formula) ?? 0;
      this.formula = "";
      setTimeout(() => this.input.focus(), 10);
    }
  },
  keyPress(v) {
    //TODO предыдущий символ
    if (this.allowedKeys.includes(v)) {
      this.setFormula(v);
      return;
    }
    if (v === "=" || v === "Enter") {
      this.toggle();
      return;
    }
    if (v === "Backspace") {
      this.formula = this.formula.slice(0, -1);
    }
    if (v === "Escape") {
      this.formula = "";
    }
    this.setDisplayFormula();
  },

  setDisplayFormula() {
    this.displayField.value = this.formula;
  },

  setFormula(v) {
    if (
      (this.formula === "" || this.formula === 0) &&
      this.operators.includes(v) &&
      v !== "-"
    ) {
      return;
    }

    this.formula += v;
    this.setDisplayFormula();
  },

  handleKeyPress(e) {
    if (this.calculatorShow) {
      e.preventDefault();
      if (e.ctrlKey && e.altKey && e.code === "KeyC") {
        this.toggle();
        return;
      }
      this.keyPress(e.key);
      return;
    }

    if (!this.calculatorShow && e.ctrlKey && e.altKey && e.code === "KeyC") {
      this.toggle();
    }
  },

  calculate() {
    let input = this.formula.replace(/\s/g, "").replace(/,/g, ".");
    if (input === "") {
      return null;
    }
    return this.processString(input);
  },
  processString(str) {
    let result = str;
    if (/\(/.test(str)) {
      let parenthesesLevel = 0;
      let start = -1;

      for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === "(") {
          if (start === -1) {
            start = i;
          }
          parenthesesLevel++;
        } else if (char === ")") {
          parenthesesLevel--;
          if (parenthesesLevel === 0) {
            const contents = str.slice(start + 1, i);
            const evaluatedContents = this.processString(contents);
            result = result.replace(`(${contents})`, evaluatedContents);
            start = -1;
          }
        }
      }
    }
    return this.evaluate(this.processPercent(result)) ?? 0;
  },
  processPercent(str) {
    const regex = /^(.*?)([+\-])(\d+(?:\.\d+)?%(?!\d))/;
    let result = str;
    while (regex.test(result)) {
      const match = regex.exec(result);
      if (!match) {
        break;
      }
      const [fullMatch, expr] = match;
      if (/^-?\d+(?:\.\d+)?$/.test(expr)) {
        result = result.replace(fullMatch, this.evaluate(fullMatch));
      } else {
        result = result.replace(expr, this.evaluate(expr));
        result = this.processPercent(result);
      }
    }
    return result;
  },
  evaluate(expression) {
    expression = expression.replace(/\*\*/g, "^");
    expression = expression.replace(
      /(^-?\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g,
      "($1*0.01*$2)"
    );
    expression = expression.replace(
      /(^-?\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g,
      "($1$2($1*$3*0.01))"
    );
    expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)");
    expression = expression.replace(/%/g, "*0.01");
    return this.evaluatePostfix(this.infixToPostfix(expression));
  },
  infixToPostfix(infix) {
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 2 };
    const stack = [];
    const postfix = [];
    let numberBuffer = [];
    let prevOperator = null;

    const flushNumberBuffer = () => {
      if (numberBuffer.length) {
        postfix.push(numberBuffer.join(""));
        numberBuffer = [];
      }
    };

    const handleOperator = (char) => {
      flushNumberBuffer();
      if (char === "(") {
        stack.push(char);
        prevOperator = null;
      } else if (char === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          postfix.push(stack.pop());
        }
        stack.pop();
      } else {
        const isUnaryMinus =
          char === "-" &&
          (prevOperator === null ||
            prevOperator === "(" ||
            prevOperator in precedence);
        if (isUnaryMinus) {
          numberBuffer.push(char);
        } else {
          while (
            stack.length &&
            precedence[char] <= precedence[stack[stack.length - 1]]
          ) {
            postfix.push(stack.pop());
          }
          stack.push(char);
        }
      }
      prevOperator = char;
    };

    for (const char of infix) {
      if (/[\d\.]/.test(char)) {
        numberBuffer.push(char);
        prevOperator = char;
      } else if (char in precedence) {
        handleOperator(char);
      }
    }

    flushNumberBuffer();
    while (stack.length) {
      postfix.push(stack.pop());
    }
    return postfix;
  },
  evaluatePostfix(postfix) {
    let stack = [];

    postfix.forEach((token) => {
      if (/^-?\d+(?:\.\d+)?$/.test(token)) {
        stack.push(parseFloat(token));
      } else {
        const right = stack.pop();
        const left = stack.pop();

        switch (token) {
          case "+":
            stack.push(left + right);
            break;
          case "-":
            stack.push(left - right);
            break;
          case "*":
            stack.push(left * right);
            break;
          case "/":
            stack.push(left / right);
            break;
          case "^":
            stack.push(left ** right);
            break;
        }
      }
    });

    return stack.pop();
  },
});
