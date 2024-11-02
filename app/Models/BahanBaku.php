<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BahanBaku extends Model
{
    use HasFactory;

    protected $fillable = [
        "id_bahan_baku",
        "nama_bahan_baku",
        "stok_bahan_baku",
        "minimum_stok",
        "satuan_bahan_baku",
        "harga_bahan_baku",
        "gambar_bahan_baku",
        "user_id",
    ];
}
