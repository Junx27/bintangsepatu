<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/api/bintangsepatu/pesanans", [ApiController::class, "pesananAll"]);
    Route::get("/api/bintangsepatu/produks", [ApiController::class, "produkAll"]);
    Route::get("/api/bintangsepatu/produk/{id}", [ApiController::class, "produkDetail"]);
    Route::get("/api/bintangsepatu/bahan-baku/{id}", [ApiController::class, "bahanBakuDetail"]);
    Route::get("/api/bintangsepatu/users", [ApiController::class, "userAll"]);
    Route::get("/api/bintangsepatu/produksi/{id}", [ApiController::class, "ProduksiDetail"]);
    Route::get("/api/bintangsepatu/produksis", [ApiController::class, "ProduksiAll"]);
    Route::get("/api/bintangsepatu/produksi-proses", [ApiController::class, "ProduksiAllProses"]);
    Route::get("/api/bintangsepatu/produksi-verification", [ApiController::class, "ProduksiAllVerified"]);
    Route::get("/api/bintangsepatu/bahan-bakus", [ApiController::class, "bahanBakuAll"]);
    Route::get("/api/bintangsepatu/laporan-produksis", [ApiController::class, "laporanProduksiAll"]);
    Route::get("/api/bintangsepatu/laporan-produksi/{id}", [ApiController::class, "laporanProduksiDetail"]);
    Route::get("/api/bintangsepatu/laporan-produksis-verified", [ApiController::class, "laporanProduksiAllVerified"]);
    Route::get("/api/bintangsepatu/laporan-produksis-verified-success", [ApiController::class, "laporanProduksiAllVerifiedSuccess"]);
    Route::get("/api/bintangsepatu/laporan-pemesanans", [ApiController::class, "laporanPemesananAll"]);
    Route::get("/api/bintangsepatu/pengirimans", [ApiController::class, "pengirimanAll"]);
    Route::get("/api/bintangsepatu/data-produksis", [ApiController::class, "dataProduksiAll"]);
    Route::get("/api/bintangsepatu/data-laporan-produksis", [ApiController::class, "dataLaporanProduksi"]);

    //api bagian gudang
    Route::get("/api/bintangsepatu/data-produk-masuk-gudang", [ApiController::class, "dataProdukMasukGudang"]);
    Route::get("/api/bintangsepatu/data-produk-masuk-gudang/{id}", [ApiController::class, "dataProdukMasukGudangDetail"]);
    Route::get("/api/bintangsepatu/data-bahan-baku-masuk-gudang", [ApiController::class, "dataBahanBakuMasuk"]);
});
