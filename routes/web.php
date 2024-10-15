<?php

use App\Http\Controllers\GudangController;
use App\Http\Controllers\PengirimanController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})
    ->name('login');


Route::get("/welcome-penjualan", [PenjualanController::class, "index"]);
Route::get("/login-penjualan", [PenjualanController::class, "login"]);
Route::get("/register-penjualan", [PenjualanController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-penjualan", [PenjualanController::class, "dashboard"])->name('dashboard.penjualan');
});







Route::get("/welcome-pengiriman", [PengirimanController::class, "index"]);
Route::get("/login-pengiriman", [PengirimanController::class, "login"]);
Route::get("/register-pengiriman", [PengirimanController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-pengiriman", [PengirimanController::class, "dashboard"])->name('dashboard.pengiriman');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
require __DIR__ . '/produksi.php';
require __DIR__ . '/gudang.php';
