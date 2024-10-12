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
        Schema::create('pengirimen', function (Blueprint $table) {
            $table->id();
            $table->string("id_pengiriman")->unique();
            $table->string("tanggal_dikirim");
            $table->string("estimasi_selesai");
            $table->string("bukti_pengiriman");
            $table->string("status_pengiriman");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("produk_id")->constrained("produks")->onDelete("cascade");
            $table->foreignId("pesanan_id")->constrained("pesanans")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengirimen');
    }
};
