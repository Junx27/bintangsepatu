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
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->string("id_pesanan")->unique();
            $table->string("nama_pemesan");
            $table->string("alamat_pemesan");
            $table->string("tanggal_pemesanan");
            $table->integer("jumlah_pesanan");
            $table->integer("total_pesanaan");
            $table->string("bukti_pembayaran");
            $table->string("status_pesanan");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("produk_id")->constrained("produks")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
