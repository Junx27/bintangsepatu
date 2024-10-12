<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_produk',
        'nama_produk',
        'harga_produk',
        'stok_produk',
        'stok_minimum_produk',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
