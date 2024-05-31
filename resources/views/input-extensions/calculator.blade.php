@props(['extension'])

<div x-cloak x-show="flCalculator.calculatorShow" class="calculator flex flex-col">
        <x-moonshine::form.input
            disabled="true"
            class="formula"
        />
        <div class="key-container">
            <div class="grid grid-cols-12 gap-1">
                <div class="col-span-3 xl:col-span-3">
                    <div class="btn" @click="flCalculator.keyPress(8)">
                        00<x-moonshine::icon
                            icon="heroicons.outline.arrow-long-right"
                            size="3"
                        />0
                    </div>
                </div>
                <div class="col-span-3 xl:col-span-3">
                    <div class="btn">
                        <x-moonshine::icon
                            icon="heroicons.outline.arrow-long-left"
                            size="4"
                        />
                    </div>
                </div>
                <div class="col-span-3 xl:col-span-3">
                    <div class="btn">
                        <x-moonshine::icon
                            icon="heroicons.outline.arrow-long-left"
                            size="4"
                        />
                    </div>
                </div>
                <div class="col-span-3 xl:col-span-3">
                    <div class="btn">
                        <x-moonshine::icon
                            icon="heroicons.outline.arrow-long-left"
                            size="4"
                        />
                    </div>
                </div>

            </div>
        </div>
</div>
<button class="expansion" type="button" @click.prevent="flCalculator.toggle()">
    <x-moonshine::icon
        icon="heroicons.outline.calculator"
        size="4"
    />
</button>
