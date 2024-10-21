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
        Schema::create('data_bahan_baku_masuks', function (Blueprint $table) {
            $table->id();
            $table->string("id_bahan_baku");
            $table->integer("jumlah_bahan_baku_masuk");
            $table->string("tanggal_masuk");
            $table->foreignId("bahan_baku_id")->constrained("bahan_bakus")->onDelete("cascade");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_bahan_baku_masuks');
    }
};
