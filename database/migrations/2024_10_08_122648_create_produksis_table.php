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
        Schema::create('produksis', function (Blueprint $table) {
            $table->id();
            $table->string("id_produksi")->unique();
            $table->string("id_produk");
            $table->string("nama_produk");
            $table->integer("jumlah_produksi");
            $table->string("tanggal_mulai");
            $table->string("estimasi_selesai");
            $table->string("status_produksi")->default("persiapan");
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
        Schema::dropIfExists('produksis');
    }
};
