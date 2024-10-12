<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatatanProduksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'catatan',
        'status',
        'user_id',
        'produk_id',
    ];
}
