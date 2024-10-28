<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataBahanBakuMasuk extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_bahan_baku',
        'jumlah_bahan_baku_masuk',
        'tanggal_masuk',
        'bahan_baku_id',
        'user_id',
    ];
    public function bahan()
    {
        return $this->belongsTo(BahanBaku::class, "bahan_baku_id");
    }
}
