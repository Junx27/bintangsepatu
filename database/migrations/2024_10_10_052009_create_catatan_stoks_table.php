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
        Schema::create('catatan_stoks', function (Blueprint $table) {
            $table->id();
            $table->string("catatan");
            $table->string("status")->default("belum dibuka");
            $table->foreignId("user_id")->constrained("users")->onDelete("cascade");
            $table->foreignId("bahan_baku_id")->constrained("bahan_bakus")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catatan_stoks');
    }
};
