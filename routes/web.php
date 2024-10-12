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

Route::get("/welcome-gudang", [GudangController::class, "index"]);
Route::get("/login-gudang", [GudangController::class, "login"]);
Route::get("/register-gudang", [GudangController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-gudang", [GudangController::class, "dashboard"])->name('dashboard.gudang');
});


Route::get("/welcome-produksi", [ProduksiController::class, "index"]);
Route::get("/login-produksi", [ProduksiController::class, "login"]);
Route::get("/register-produksi", [ProduksiController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-produksi", [ProduksiController::class, "dashboard"])->name('dashboard.produksi');
    Route::get("/daftar-pesanan-produksi", [ProduksiController::class, "daftarPesanan"])->name('daftar.pesanan.produksi');
    Route::get("/daftar-produk-produksi", [ProduksiController::class, "daftarProduk"])->name('daftar.produk.produksi');
    Route::post("/create-catatan-produk-produksi", [ProduksiController::class, "createCatatanProduk"])->name('create.catatan.produk.produksi');
    Route::post("/create-catatan-stok-produksi", [ProduksiController::class, "createCatatanStok"])->name('create.catatan.stok.produksi');
    Route::post("/create-data-produksi-produksi", [ProduksiController::class, "createDataProduksi"])->name('create.dataproduksi.produksi');
    Route::delete("/daftar-produk-produksi/{id}", [ProduksiController::class, "deleteProduk"])->name('delete.produk.produksi');
    Route::post("/create-produk-produksi", [ProduksiController::class, "createProduk"])->name('create.produk.produksi');
    Route::post("/create-produksi-produksi", [ProduksiController::class, "createProduksi"])->name('create.produksi.produksi');
    Route::get("/daftar-repair-produksi", [ProduksiController::class, "daftarRepair"])->name('daftar.repair.produksi');
    Route::get("/laporan-produksi", [ProduksiController::class, "laporan"])->name('laporan.produksi');
    Route::get("/daftar-stok-produksi", [ProduksiController::class, "daftarStok"])->name('daftar.stok.produksi');
    Route::get("/daftar-produksi-produksi", [ProduksiController::class, "daftarProduksi"])->name('daftar.produksi.produksi');
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
