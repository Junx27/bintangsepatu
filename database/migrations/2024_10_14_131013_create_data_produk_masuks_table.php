<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_produk_masuks', function (Blueprint $table) {
            $table->id();
            $table->string("id_produksi_masuk")->unique();
            $table->string("id_laporan");
            $table->string("id_produksi");
            $table->string("id_produk");
            $table->string("tanggal_pengiriman_produk");
            $table->string("tanggal_penerimaan_produk")->nullable();
            $table->integer("jumlah_produksi");
            $table->integer("biaya_awal_produksi");
            $table->integer("biaya_akhir_produksi");
            $table->integer("jumlah_produk_diterima")->default(0);
            $table->integer("jumlah_produk_ditolak")->default(0);
            $table->string("status_penerimaan_produk")->default("pending");
            $table->foreignId("laporan_id")->constrained("laporan_produksis")->onDelete("cascade");
            $table->foreignId("produksi_id")->constrained("produksis")->onDelete("cascade");
            $table->foreignId("produk_id")->constrained("produks")->onDelete("cascade");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_produk_masuks');
    }
};
