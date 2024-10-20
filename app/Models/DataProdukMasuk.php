<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataProdukMasuk extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_produksi_masuk',
        'id_laporan',
        'id_produksi',
        'id_produk',
        'tanggal_pengiriman_produk',
        'tanggal_penerimaan_produk',
        'jumlah_produksi',
        'biaya_awal_produksi',
        'biaya_akhir_produksi',
        'jumlah_produk_diterima',
        'jumlah_produk_ditolak',
        'status_penerimaan_produk',
        'laporan_id',
        'produksi_id',
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
