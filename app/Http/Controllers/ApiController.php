<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DataProduksi;
use App\Models\LaporanPemesanan;
use App\Models\LaporanProduksi;
use App\Models\Pengiriman;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\User;
use Illuminate\Http\Request;
use PhpParser\Node\Expr\Cast\String_;

class ApiController extends Controller
{
    public function pesananAll()
    {
        $data = Pesanan::with("produk:id,id_produk,nama_produk,harga_produk")->get();
        return response()->json($data);
    }
    public function produkAll()
    {
        $data = Produk::with("user:id,name")->get();
        return response()->json($data);
    }
    public function produkDetail(String $id)
    {
        $data = Produk::findOrFail($id);
        return response()->json($data);
    }
    public function userAll()
    {
        $data = User::all();
        return response()->json($data);
    }
    public function ProduksiAll()
    {
        $data = Produksi::where("status_produksi", "diproses")->get();
        return response()->json($data);
    }
    public function ProduksiDetail(String $id)
    {
        $data = Produksi::findOrFail($id);
        return response()->json($data);
    }
    public function ProduksiAllProses()
    {
        $data = Produksi::where("status_produksi", "persiapan")->get();
        return response()->json($data);
    }
    public function bahanBakuAll()
    {
        $data = BahanBaku::all();
        return response()->json($data);
    }
    public function bahanBakuDetail(String $id)
    {
        $data = BahanBaku::findOrFail($id);
        return response()->json($data);
    }
    public function laporanProduksiAll()
    {
        $data = LaporanProduksi::all();
        return response()->json($data);
    }
    public function laporanPemesananAll()
    {
        $data = LaporanPemesanan::all();
        return response()->json($data);
    }
    public function pengirimanAll()
    {
        $data = Pengiriman::all();
        return response()->json($data);
    }
    public function dataProduksiAll()
    {
        $data = DataProduksi::with("bahan:id,id_bahan_baku,nama_bahan_baku,stok_bahan_baku")->get();
        return response()->json($data);
    }
}
