export default (el) => ({
  el: el,
  input: {
    el: null,
    isNumber: false,
    min: null,
    max: null,
    step: null,
  },
  numberOptions: {
    decimalSeparator: null,
    thousandsSeparator: null,
    decimalDigits: 0,
  },
  calculatorShow: false,
  formula: "",
  displayField: null,
  allowedKeys: "0123456789+-*/(),.%^",
  operators: "+-*/%^",
  isMask: false,

  //TODO обработка локали для корректного вывода чисел
  init() {
    this.input.el = el.querySelector("input");
    this.input.isNumber = this.input.el.type === "number";
    if (this.input.isNumber) {
      this.input.min = this.input.el.min;
      this.input.max = this.input.el.max;
      this.input.step = this.input.el.step;
    }
    this.displayField = el.querySelector(".calculator input.formula");
    this.el.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.calculatorShow = false;
    document.addEventListener("click", this.handleOutsideClick.bind(this));
    this.mask();
  },

  handleOutsideClick(event) {
    if (!this.el.contains(event.target) && this.calculatorShow) {
      this.toggle();
    }
  },
  mask() {
    const mask = this.input.el.getAttribute("x-mask");
    const moneyMask = this.input.el.getAttribute("x-mask:dynamic");
    if (!mask && !moneyMask) {
      return null;
    }
    if (mask) {
      this.isMask = this.parseNumberMask(mask);
    }
    if (moneyMask) {
      this.isMask = this.parseMoneyMask(moneyMask);
    }
  },

  parseNumberMask(str) {
    const regex = /\d+|[.,\s]/g;
    const matches = str.match(regex);
    if (!matches) {
      return false;
    }
    let isSeparatorStack = false;
    const stack = [];
    matches.reverse().map((match, i, ar) => {
      if (!/\d/.test(match)) {
        if (stack.includes(match) && !isSeparatorStack) {
          isSeparatorStack = true;
        } else {
          stack.push(match);
        }
      }
    });

    if (stack.length === 2) {
      this.numberOptions.thousandsSeparator = stack.pop();
      this.numberOptions.decimalSeparator = stack.pop();
    } else if (stack.length === 1 && !isSeparatorStack) {
      this.numberOptions.decimalSeparator = stack.pop();
    } else if (stack.length === 1 && isSeparatorStack) {
      this.numberOptions.thousandsSeparator = stack.pop();
    }
    this.numberOptions.decimalDigits = /\d/.test(matches[0])
      ? matches[0].length
      : 0;
    const maxNumber = this.numberFormatterParse(str);
    this.el.max = maxNumber ?? 0;
    return true;
  },
  numberFormatterParse(str) {
    const { decimalSeparator, thousandsSeparator } = this.numberOptions;
    const trimmedInput = str.trim();
    const allowedCharsRegex = new RegExp(
      `^[-]?[\\d${decimalSeparator}${thousandsSeparator}]*$`,
      "g"
    );
    if (!allowedCharsRegex.test(trimmedInput)) {
      return null;
    }
    const cleanInput = trimmedInput
      .replace(thousandsSeparator, "")
      .replace(decimalSeparator, ".");

    if (cleanInput === "") {
      return null;
    }

    const parsedValue = parseFloat(cleanInput);

    if (isNaN(parsedValue)) {
      return null;
    }

    return parsedValue;
  },
  parseMoneyMask(str) {
    const regexTest =
      /\$money\(\$input,\s*'([^']*(?:''[^']*)*)'\s*(?:,\s*'([^']*(?:''[^']*)*)')?\s*(?:,\s*'([^']*(?:''[^']*)*)')?\s*(?:,\s*(\d+))?\)/g;
    const matches = regexTest.exec(str);
    if (!str.includes("money") && !matches) {
      return false;
    }
    if (matches) {
      const [
        ,
        decimalSeparator = ".",
        thousandsSeparator = "",
        decimalDigits = 2,
      ] = matches;
      this.numberOptions = {
        decimalSeparator,
        thousandsSeparator,
        decimalDigits,
      };
    } else {
      this.numberOptions = {
        decimalSeparator: ".",
        thousandsSeparator: "",
        decimalDigits: 2,
      };
    }

    return true;
  },
  toggle() {
    this.calculatorShow = !this.calculatorShow;

    if (this.calculatorShow) {
      this.formula = this.numberFormatterParse(this.input.el.value)
        ? this.input.el.value.replace(/\s/g, "")
        : this.formula;
      this.setDisplayFormula();
    } else {
      this.input.el.value = this.formatValue(this.calculate(this.formula) ?? 0);
      this.formula = "";
      setTimeout(() => this.input.el.focus(), 10);
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

  formatValue(value) {
    if (this.input.isNumber) {
      const fractionDigits = (s) => s.toString().split(".")[1].length || 0;
      return Math.min(
        Math.max(
          value.toFixed(fractionDigits(this.input.step)),
          this.input.min
        ),
        this.input.max
      );
    }
    if (this.isMask) {
      if (this.el.max && value > this.el.max) {
        value = this.el.max;
      }
      return this.numberFormatterFormat(value);
    }

    return value;
  },
  numberFormatterFormat(value) {
    const { decimalSeparator, thousandsSeparator, decimalDigits } =
      this.numberOptions;
    const formattedValue = value.toFixed(decimalDigits);
    const parts = formattedValue.split(".");
    parts[0] = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandsSeparator ?? ""
    );
    return parts.join(decimalSeparator);
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
        result = result.replace(fullMatch, this.evaluate(fullMatch).toString());
      } else {
        result = result.replace(expr, this.evaluate(expr).toString());
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

    expression = expression.replace(
      /(^-?\d+(?:\.\d+)?)(\/)(\d+(?:\.\d+)?)%/g,
      "$1$2($3*0.01)"
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
