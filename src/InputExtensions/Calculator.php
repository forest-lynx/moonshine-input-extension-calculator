<?php

declare(strict_types=1);

namespace ForestLynx\MoonShine\InputExtensions;

use MoonShine\InputExtensions\InputExtension;

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
}
