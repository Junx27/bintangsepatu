<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanProduksi extends Model
{
    use HasFactory;
    protected $fillable = [
        "id_laporan",
        "id_produk",
        "id_produksi",
        "tanggal_mulai",
        "tanggal_selesai",
        "estimasi_selesai",
        "jumlah_produksi",
        "biaya_produksi",
        "status_produksi",
        "penanggung_jawab_produksi",
        "status_pengiriman",
        "user_id",
        "produk_id",
        "produksi_id",
    ];
    public function produk()
    {
        return $this->belongsTo(Produk::class, "produk_id");
    }
}
