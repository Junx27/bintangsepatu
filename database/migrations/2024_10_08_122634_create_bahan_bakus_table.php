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
        Schema::create('bahan_bakus', function (Blueprint $table) {
            $table->id();
            $table->string("id_bahan_baku")->unique();
            $table->string("nama_bahan_baku");
            $table->integer("stok_bahan_baku");
            $table->integer("minimum_stok");
            $table->string("satuan_bahan_baku");
            $table->integer("harga_bahan_baku");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bahan_bakus');
    }
};
