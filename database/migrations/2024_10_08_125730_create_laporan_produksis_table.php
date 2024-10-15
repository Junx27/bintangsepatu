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
        Schema::create('laporan_produksis', function (Blueprint $table) {
            $table->id();
            $table->string("id_laporan")->unique();
            $table->string("id_produk");
            $table->string("id_produksi");
            $table->string("tanggal_mulai");
            $table->string("tanggal_selesai");
            $table->string("estimasi_selesai");
            $table->integer("jumlah_produksi");
            $table->integer("biaya_produksi");
            $table->string("status_produksi")->default("belum diverifikasi");
            $table->string("penanggung_jawab_produksi");
            $table->string("status_pengiriman")->default("belum dikirim");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("produk_id")->constrained("produks")->onDelete("cascade");
            $table->foreignId("produksi_id")->constrained("produksis")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_produksis');
    }
};
