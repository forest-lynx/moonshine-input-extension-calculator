import { StringCalculator } from "@forest-lynx/string-calculator";
export default (el) => ({
  el: el,
  input: {
    el: null,
    isNumber: false,
  },
  numberOptions: {
    decimalSeparator: ".",
    thousandsSeparator: "",
    decimalDigits: 2,
    min: null,
    max: null,
  },
  calculatorShow: false,
  calculatorError: false,
  errorEl: null,
  formula: "0",
  displayField: null,
  allowedKeys: "0123456789+-*/(),.%^ ",
  operators: "+-*/%^",
  isMask: false,
  stringCalculator: null,
  errorMessages: null,

  //TODO обработка локали для корректного вывода чисел
  init() {
    this.input.el = el.querySelector("input");
    this.input.isNumber = this.input.el.type === "number";
    if (this.input.isNumber) {
      this.numberOptions.min = this.input.el.min;
      this.numberOptions.max = this.input.el.max;
    }
    const calcEl = el.querySelector(".calculator");
    this.displayField = calcEl.querySelector("input.formula");
    this.errorMessages = JSON.parse(calcEl.dataset.errorMessages);
    this.errorEl = el.querySelector(".calculator .calculator-error");
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
      this.stringCalculator = new StringCalculator();
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
    this.numberOptions.decimalDigits = this.input.isNumber
      ? this.input.el.step.toString().split(".")[1].length || 0
      : /\d/.test(str)
        ? str.length
        : 0;
    this.stringCalculator = new StringCalculator(this.numberOptions);
    this.numberOptions.min = 0;
    try {
      const maxNumber = this.stringCalculator.parse(str);
      this.numberOptions.max = maxNumber;
    } catch (error) {
      this.numberOptions.max = 0;
    }
    this.stringCalculator = new StringCalculator(this.numberOptions);

    return true;
  },

  parseMoneyMask(str) {
    const regexTest =
      /\$money\(\$input,\s*'([^']*(?:''[^']*)*)'\s*(?:,\s*'([^']*(?:''[^']*)*)')?\s*(?:,\s*'([^']*(?:''[^']*)*)')?\s*(?:,\s*(\d+))?\)/g;
    const matches = regexTest.exec(str);
    if (!str.includes("money") && !matches) {
      this.stringCalculator = new StringCalculator(this.numberOptions);
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
    }

    this.stringCalculator = new StringCalculator(this.numberOptions);
    return true;
  },
  toggle() {
    this.calculatorShow = !this.calculatorShow;
    this.calculatorError = false;

    if (this.calculatorShow) {
      try {
        this.formula = this.stringCalculator
          .parse(this.input.el.value)
          .toString();
      } catch (error) {
        this.formula = "0";
      }
      this.setDisplayFormula();
    } else {
      try {
        this.input.el.value = this.stringCalculator.calculate(this.formula);
        this.formula = "0";
        setTimeout(() => this.input.el.focus(), 10);
      } catch (error) {
        if (error instanceof Error) {
          this.calculatorShow = true;
          this.errorEl.textContent =
            this.errorMessages[error.message] || error.message;
          this.calculatorError = true;
        }
      }
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
      this.formula = "0";
    }

    this.setDisplayFormula();
  },

  setDisplayFormula() {
    this.displayField.value = this.formula;
    this.calculatorError = false;
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
});
