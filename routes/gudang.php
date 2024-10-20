<?php

use App\Http\Controllers\GudangController;
use Illuminate\Support\Facades\Route;

Route::get("/welcome-gudang", [GudangController::class, "index"]);
Route::get("/login-gudang", [GudangController::class, "login"]);
Route::get("/register-gudang", [GudangController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-gudang", [GudangController::class, "dashboard"])->name('dashboard.gudang');
    Route::get("/produk-masuk-gudang", [GudangController::class, "produkMasuk"])->name('produk.masuk.gudang');
    Route::get("/produk-keluar-gudang", [GudangController::class, "produkKeluar"])->name('produk.keluar.gudang');
    Route::get("/pesan-masuk-gudang", [GudangController::class, "pesanMasuk"])->name('pesan.masuk.gudang');
    Route::get("/bahan-baku-gudang", [GudangController::class, "bahanBaku"])->name('bahan.baku.gudang');
    Route::post("/bahan-baku-gudang", [GudangController::class, "createBahanBaku"])->name('create.bahan.baku.gudang');
    Route::get("/laporan-gudang", [GudangController::class, "laporanGudang"])->name('laporan.gudang');
    Route::put("/laporan-gudang/{id}", [GudangController::class, "laporanGudangUpdate"])->name('update.laporan.gudang');
    Route::put("/laporan-gudang-edit/{id}", [GudangController::class, "laporanGudangUpdateEdit"])->name('update.edit.laporan.gudang');
});
