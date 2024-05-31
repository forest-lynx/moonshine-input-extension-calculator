<?php

declare(strict_types=1);

namespace ForestLynx\MoonShine\Providers;

use Illuminate\Support\ServiceProvider;

final class CalculatorServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'moonshine-fl');

        $this->publishes([
            __DIR__ . '/../../public' => public_path('vendor/moonshine-input-extension-calculator'),
        ], ['moonshine-input-extension-calculator', 'laravel-assets']);

        moonshineAssets()->add([
            '/vendor/moonshine-input-extension-calculator/css/flCalculator.css',
            '/vendor/moonshine-input-extension-calculator/js/flCalculator.js',
         ]);
    }
}
