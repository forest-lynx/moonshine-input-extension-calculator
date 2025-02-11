<?php

declare(strict_types=1);

namespace ForestLynx\MoonShine\Providers;

use Illuminate\Support\ServiceProvider;

final class CalculatorServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'moonshine-fl');

        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'calculator-lang-fl');

        $this->publishes([
            __DIR__ . '/../../resources/lang' => $this->app->langPath('vendor/moonshine-input-extension-calculator'),
        ], 'calculator-lang-fl');

        $this->publishes([
            __DIR__ . '/../../public' => public_path('vendor/moonshine-input-extension-calculator'),
        ], ['moonshine-input-extension-calculator', 'laravel-assets']);
    }
}
