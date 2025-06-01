<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Center;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'centers' => fn() => Center::select('center_id', 'center_name')->orderBy('center_name')->get(),
            'selected_center_id' => fn() => session('selected_center_id'),
        ]);
    }
}
