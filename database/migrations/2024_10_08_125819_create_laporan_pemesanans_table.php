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
        Schema::create('laporan_pemesanans', function (Blueprint $table) {
            $table->id();
            $table->string("id_laporan")->unique();
            $table->string("id_pesanan");
            $table->string("id_pengiriman");
            $table->string("nama_pemesan");
            $table->integer("jumlah_pesanan");
            $table->integer("total_pesanan");
            $table->string("tanggal_dikirim");
            $table->string("tanggal_sampai");
            $table->string("bukti_pengiriman");
            $table->string("bukti_pembayaran");
            $table->string("status_pemesanan");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("pesanan_id")->constrained("pesanans")->onDelete("cascade");
            $table->foreignId("pengiriman_id")->constrained("pengirimen")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_pemesanans');
    }
};
