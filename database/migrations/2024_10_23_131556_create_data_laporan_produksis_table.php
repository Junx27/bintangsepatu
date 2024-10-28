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
        Schema::create('data_laporan_produksis', function (Blueprint $table) {
            $table->id();
            $table->integer("jumlah_bahan_baku");
            $table->integer("pemakaian_bahan_baku");
            $table->integer("sisa_bahan_baku");
            $table->foreignId("bahan_baku_id")->constrained("bahan_bakus")->onDelete("cascade");
            $table->foreignId("laporan_id")->constrained("laporan_produksis")->onDelete("cascade");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_laporan_produksis');
    }
};
