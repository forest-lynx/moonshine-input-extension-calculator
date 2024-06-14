const n=o=>({el:o,input:null,calculatorShow:!1,formula:"",displayField:null,allowedKeys:"0123456789+-*/(),.%^",operators:"+-*/%^",init(){this.input=o.querySelector("input"),this.displayField=o.querySelector(".calculator input.formula"),this.el.addEventListener("keydown",this.handleKeyPress.bind(this)),this.calculatorShow=!1},toggle(){this.calculatorShow=!this.calculatorShow,this.calculatorShow?(this.formula=this.input.value?parseFloat(this.input.value).toString():this.formula,this.setDisplayFormula()):(this.input.value=this.calculate(this.formula)??0,this.formula="",setTimeout(()=>this.input.focus(),10))},keyPress(e){if(this.allowedKeys.includes(e)){this.setFormula(e);return}if(e==="="||e==="Enter"){this.toggle();return}e==="Backspace"&&(this.formula=this.formula.slice(0,-1)),e==="Escape"&&(this.formula=""),this.setDisplayFormula()},setDisplayFormula(){this.displayField.value=this.formula},setFormula(e){(this.formula===""||this.formula===0)&&this.operators.includes(e)&&e!=="-"||(this.formula+=e,this.setDisplayFormula())},handleKeyPress(e){if(e.preventDefault(),e.ctrlKey&&e.altKey&&e.code==="KeyC"){this.toggle();return}this.keyPress(e.key)},calculate(){let e=this.formula.replace(/\s/g,"").replace(/,/g,".");return e===""?null:this.processString(e)},processString(e){let l=e;if(/\(/.test(e)){let t=0,i=-1;for(let s=0;s<e.length;s++){const r=e[s];if(r==="(")i===-1&&(i=s),t++;else if(r===")"&&(t--,t===0)){const u=e.slice(i+1,s),h=this.processString(u);l=l.replace(`(${u})`,h),i=-1}}}return this.evaluate(this.processPercent(l))??0},processPercent(e){const l=/^(.*?)([+\-])(\d+(?:\.\d+)?%(?!\d))/;let t=e;for(;l.test(t);){const i=l.exec(t);if(!i)break;const[s,r]=i;/^-?\d+(?:\.\d+)?$/.test(r)?t=t.replace(s,this.evaluate(s)):(t=t.replace(r,this.evaluate(r)),t=this.processPercent(t))}return t},evaluate(e){return e=e.replace(/\*\*/g,"^"),e=e.replace(/(^-?\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g,"($1*0.01*$2)"),e=e.replace(/(^-?\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g,"($1$2($1*$3*0.01))"),e=e.replace(/(\d+(?:\.\d+)?)%/g,"($1*0.01)"),e=e.replace(/%/g,"*0.01"),this.evaluatePostfix(this.infixToPostfix(e))},infixToPostfix(e){const l={"+":1,"-":1,"*":2,"/":2,"^":2},t=[],i=[];let s=[],r=null;const u=()=>{s.length&&(i.push(s.join("")),s=[])},h=a=>{if(u(),a==="(")t.push(a),r=null;else if(a===")"){for(;t.length&&t[t.length-1]!=="(";)i.push(t.pop());t.pop()}else if(a==="-"&&(r===null||r==="("||r in l))s.push(a);else{for(;t.length&&l[a]<=l[t[t.length-1]];)i.push(t.pop());t.push(a)}r=a};for(const a of e)/[\d\.]/.test(a)?(s.push(a),r=a):a in l&&h(a);for(u();t.length;)i.push(t.pop());return i},evaluatePostfix(e){let l=[];return e.forEach(t=>{if(/^-?\d+(?:\.\d+)?$/.test(t))l.push(parseFloat(t));else{const i=l.pop(),s=l.pop();switch(t){case"+":l.push(s+i);break;case"-":l.push(s-i);break;case"*":l.push(s*i);break;case"/":l.push(s/i);break;case"^":l.push(s**i);break}}}),l.pop()}});document.addEventListener("alpine:init",()=>{Alpine.data("flCalculator",n)});