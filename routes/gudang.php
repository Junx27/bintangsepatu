<?php

use App\Http\Controllers\GudangController;
use Illuminate\Support\Facades\Route;

Route::get("/welcome-gudang", [GudangController::class, "index"]);
Route::get("/login-gudang", [GudangController::class, "login"]);
Route::get("/register-gudang", [GudangController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-gudang", [GudangController::class, "dashboard"])->name('dashboard.gudang');
});
