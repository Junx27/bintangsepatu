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
            $table->string("id_pesanan");
            $table->string("id_produk");
            $table->string("id_produksi");
            $table->string("id_bahan_baku");
            $table->string("tanggal_mulai");
            $table->string("tanggal_selesai");
            $table->integer("jumlah_produksi");
            $table->integer("total_produksi");
            $table->string("status_laporan");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("produk_id")->constrained("produks")->onDelete("cascade");
            $table->foreignId("pesanan_id")->constrained("pesanans")->onDelete("cascade");
            $table->foreignId("produksi_id")->constrained("produksis")->onDelete("cascade");
            $table->foreignId("bahan_baku_id")->constrained("bahan_bakus")->onDelete("cascade");
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
