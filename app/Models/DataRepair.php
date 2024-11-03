<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataRepair extends Model
{
    use HasFactory;

    protected $fillable = [
        'jumlah_produk_repair',
        'produk_id',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function produk()
    {
        return $this->belongsTo(Produk::class, "produk_id");
    }
}
