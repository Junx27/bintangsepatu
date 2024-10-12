<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_produksi',
        'id_produk',
        'nama_produk',
        'jumlah_produksi',
        'tanggal_mulai',
        'estimasi_selesai',
        'status_produksi',
        'user_id',
        'produk_id',
    ];
}
