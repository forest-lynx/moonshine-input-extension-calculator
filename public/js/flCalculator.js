document.addEventListener("alpine:init", () => {
  Alpine.data("flCalculator", (el) => ({
    el: el,
    input: null,
    calculatorShow: false,
    formula: "",
    displayField: null,
    allowedKeys: "0123456789+-*/(),.",
    operators: "+-*/%",
    regex: /\d+(\.\d+)?|[+\-*/%\(\)]/g,
    //TODO добавить логику при работе с полем number min max step
    init() {
      this.input = el.querySelector("input");
      this.displayField = el.querySelector(".calculator input.formula");
      this.el.addEventListener("keydown", this.handleKeyPress.bind(this));
      this.calculatorShow = false;
    },

    toggle() {
      this.calculatorShow = !this.calculatorShow;
      if (!this.calculatorShow) {
        this.input.value = this.calculate();
        console.log(this.input.value);
        this.formula = "";
        setTimeout(() => this.input.focus(), 50);
      } else {
        this.formula = parseFloat(this.input.value) || "";
        this.setDisplayFormula();
      }
    },

    keyPress(v) {
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
        this.operators.includes(v)
      ) {
        return;
      }

      this.formula += v;
      this.setDisplayFormula();
    },

    handleKeyPress(e) {
      this.keyPress(e.key);
    },

    calculate() {
      const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "%": 2,
        "(": 0,
      };
      const tokens = this.formula.replace(/\s/g, "").match(this.regex) || [];
      const postfix = [];
      const stack = [];

      for (const token of tokens) {
        if (/\d/.test(token)) {
          postfix.push(parseFloat(token));
        } else if (token === "(") {
          stack.push(token);
        } else if (token === ")") {
          while (stack.length && stack[stack.length - 1] !== "(") {
            postfix.push(stack.pop());
          }
          stack.pop();
        } else {
          while (
            stack.length &&
            precedence[token] <= precedence[stack[stack.length - 1]]
          ) {
            postfix.push(stack.pop());
          }
          stack.push(token);
        }
      }

      while (stack.length) {
        postfix.push(stack.pop());
      }

      const resultStack = [];
      for (const token of postfix) {
        if (!this.operators.includes(token)) {
          resultStack.push(token);
        } else {
          const b = resultStack.pop();
          const a = resultStack.pop();
          switch (token) {
            case "+":
              resultStack.push(a + b);
              break;
            case "-":
              resultStack.push(a - b);
              break;
            case "*":
              resultStack.push(a * b);
              break;
            case "/":
              resultStack.push(a / b);
              break;
            case "%":
              resultStack.push(a % b);
              break;
          }
        }
      }

      return resultStack.pop() || 0;
    },
  }));
});
