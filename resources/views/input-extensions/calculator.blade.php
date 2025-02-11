@props([
    'isKeyboard' => true
])
@php
   $errorMessages = [];

    $errors = [
        'Invalid characters in a string' => 'calculator-lang-fl::errors::errors.invalid_chars',
        'Empty input string' => 'calculator-lang-fl::errors.empty_str',
        'Invalid number format' => 'calculator-lang-fl::errors.invalid_num',
        'Unbalanced parentheses in expression' => 'calculator-lang-fl::errors.unbal_parens',
        'Invalid expression' => 'calculator-lang-fl::errors.invalid_expr',
        'Division by zero' => 'calculator-lang-fl::errors.div_zero',
        'Empty expression' => 'calculator-lang-fl::errors.empty_expr',
    ];

    foreach ($errors as $key => $langKey) {
        if (Lang::has($langKey)) {
            $errorMessages[$key] = __($langKey);
        }
    }
@endphp

<div x-cloak x-show="flCalculator.calculatorShow" class="calculator" data-error-messages='@json($errorMessages)'>
@if($isKeyboard)
<x-moonshine::form.input
    disabled="true"
    class="formula"
/>
<div class="keyboard-container">
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-6 btn-error" @click="flCalculator.keyPress('Escape')">C</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('Backspace')">←</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('%')">%</button>
    </div>
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('(')">(</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(')')">)</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('^')">^</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('/')">&#247;</button>
    </div>
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(7)">7</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(8)">8</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(9)">9</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('*')">&#215;</button>
    </div>
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(4)">4</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(5)">5</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(6)">6</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('-')">-</button>
    </div>
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(1)">1</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(2)">2</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(3)">3</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('+')">+</button>
    </div>
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress(0)">0</button>
        <button type="button" class="btn btn-col-3" @click="flCalculator.keyPress('.')">.</button>
        <button type="button" class="btn btn-col-6 btn-primary" @click="flCalculator.keyPress('Enter')">=</button>
    </div>
</div>

@else
<x-moonshine::form.input
    class="formula"
    disabled="true"
/>
<div class="keyboard-container">
    <div class="keyboard-container-line">
        <button type="button" class="btn btn-col-6 btn-error" @click="flCalculator.keyPress('Escape')">C</button>
        <button type="button" class="btn btn-col-6 btn-primary" @click="flCalculator.keyPress('Enter')">=</button>
    </div>
</div>
@endif
<div x-show="flCalculator.calculatorError" class="calculator-error"></div>
</div>
<button class="expansion" type="button" @click.prevent="flCalculator.toggle()">
    <x-moonshine::icon
        icon="calculator"
        size="4"
    />
</button>
