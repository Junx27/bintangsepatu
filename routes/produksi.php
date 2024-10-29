<?php

use App\Http\Controllers\ProduksiController;
use Illuminate\Support\Facades\Route;

Route::get("/welcome-produksi", [ProduksiController::class, "index"]);
Route::get("/login-produksi", [ProduksiController::class, "login"]);
Route::get("/register-produksi", [ProduksiController::class, "register"]);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/dashboard-produksi", [ProduksiController::class, "dashboard"])->name('dashboard.produksi');
    Route::get("/daftar-pesanan-produksi", [ProduksiController::class, "daftarPesanan"])->name('daftar.pesanan.produksi');
    Route::get("/daftar-produk-produksi", [ProduksiController::class, "daftarProduk"])->name('daftar.produk.produksi');
    Route::post("/create-data-produksi-produksi", [ProduksiController::class, "createDataProduksi"])->name('create.dataproduksi.produksi');
    Route::delete("/daftar-produk-produksi/{id}", [ProduksiController::class, "deleteProduk"])->name('delete.produk.produksi');
    Route::post("/create-produk-produksi", [ProduksiController::class, "createProduk"])->name('create.produk.produksi');
    Route::put("/update-produk-produksi/{id}", [ProduksiController::class, "updateProduk"])->name('update.produk.produksi');
    Route::post("/create-laporan-produksi", [ProduksiController::class, "createLaporan"])->name('create.laporan.produksi');
    Route::post("/create-produksi-produksi", [ProduksiController::class, "createProduksi"])->name('create.produksi.produksi');
    Route::get("/daftar-repair-produksi", [ProduksiController::class, "daftarRepair"])->name('daftar.repair.produksi');
    Route::get("/laporan-produksi", [ProduksiController::class, "laporan"])->name('laporan.produksi');
    Route::get("/daftar-stok-produksi", [ProduksiController::class, "daftarStok"])->name('daftar.stok.produksi');
    Route::get("/daftar-produksi-produksi", [ProduksiController::class, "daftarProduksi"])->name('daftar.produksi.produksi');
    Route::post("/create-sisa-bahan-baku-produksi", [ProduksiController::class, "createSisaBahanBaku"])->name('create.sisa.bahan.baku.produksi');
    Route::post("/create-data-produk-masuk", [ProduksiController::class, "createDataProdukMasuk"])->name('create.data.produk.masuk');
});
