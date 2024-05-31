<?php

declare(strict_types=1);

namespace ForestLynx\MoonShine\InputExtensions;

use MoonShine\InputExtensions\InputExtension;

class Calculator extends InputExtension
{
    protected string $view = 'moonshine-fl::input-extensions.calculator';
    protected string $key = '';

    public function __construct(protected mixed $value = null)
    {
        $this->key = (string) str()->ulid();

        $this->xData = [
            "flCalculator",
        ];
        $this->xInit = [
            '$nextTick(() => { flCalculator = flCalculator($el);
            flCalculator.init(); })'
        ];
    }

    public function getKey(): string
    {
        return $this->key;
    }
}
