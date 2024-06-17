# Input extension - калькулятор
[![Software License][ico-license]](LICENSE)

[![Laravel][ico-laravel]](Laravel) [![PHP][ico-php]](PHP) 

Input extension для отображения калькулятора у поля к административной панели [MoonShine](https://moonshine-laravel.com/). 

## Содержание
* [Установка](#установка)
* [Использование](#использование)
* [Лицензия](#лицензия)

## Установка
Команда для установки:
```bash
composer require forest-lynx/moonshine-input-extension-calculator
```
## Использование
```php
<?php
//...
use ForestLynx\MoonShine\InputExtensions\Calculator;
//...
Text::make('Price')
    ->extension(new Calculator());
//or
Text::make('Price')
    ->extension(new Calculator(isKeyboard: false));
```
Имеется не обязательный параметр `isKeyboard`, по умолчанию `true`, который отвечает за отображение калькулятора с клавиатурой.
Как это выглядит в административной панели:
|С клавиатурой|Без клавиатуры|
|:--:|:--:|
|![preview](./screenshots/isKeyboard.png)|![edit](./screenshots/noKeyboard.png)|

>[!NOTE]
>Для активации калькулятора доступно сочетание клавиш `Ctrl+Alt+c` при активном поле, или по кнопке extension поля.

При активном калькуляторе осуществляется отслеживание нажатий клавиш, доступны следующие значения - `[0-9]`, `+`, `-`, `*`, `/`, `=`, `%`, `^`, `.`, `,` , `(`, `)`, `Backspace`, `Enter`, `Escape`.
Описание некоторых значений:
- `%` - вычисление процента,
- `^` - возведение в степень,
- `Backspace` - удаление последнего символа,
- `Enter` - вычисление,
- `Escape` - очистка поля.

> Имеется поддержка поля с типом `number`, это значит, что учитывается минимальное(min), максимальное(max) значение, а так же шаг(step) поля.

## Лицензия
[Лицензия MIT](LICENSE).


[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[ico-laravel]: https://img.shields.io/badge/Laravel-10+-FF2D20?style=for-the-badge&logo=laravel
[ico-php]: https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php
