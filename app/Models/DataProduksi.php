<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataProduksi extends Model
{
    use HasFactory;

    protected $fillable = [
        "stok_awal",
        'jumlah_bahan_baku',
        'bahan_baku_id',
        'produksi_id',
        'user_id',
    ];
    public function bahan()
    {
        return $this->belongsTo(BahanBaku::class, "bahan_baku_id");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
