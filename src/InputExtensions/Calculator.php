<?php

declare(strict_types=1);

namespace ForestLynx\MoonShine\InputExtensions;

use MoonShine\AssetManager\Css;
use MoonShine\AssetManager\Js;
use MoonShine\UI\InputExtensions\InputExtension;

class Calculator extends InputExtension
{
    protected string $view = 'moonshine-fl::input-extensions.calculator';

    protected array $xData = ['flCalculator'];

    protected array $xInit = [
        '$nextTick(() => { flCalculator = flCalculator($el);
        flCalculator.init(); })'
    ];

    public function __construct(protected bool $isKeyboard = true, protected mixed $value = null)
    {
        parent::__construct($value);
    }

    public function isKeyboard(): bool
    {
        return $this->isKeyboard;
    }

    protected function assets(): array
    {
        return [
            Css::make('vendor/moonshine-input-extension-calculator/css/main.css'),
            Js::make('vendor/moonshine-input-extension-calculator/js/app.js')
        ];
    }

    protected function viewData(): array
    {
        return [
            'isKeyboard' => $this->isKeyboard(),
        ];
    }
}
