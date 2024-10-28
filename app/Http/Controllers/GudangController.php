<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DataBahanBakuMasuk;
use App\Models\DataProdukMasuk;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpParser\Node\Expr\Cast\String_;

class GudangController extends Controller
{
    public function index()
    {
        return Inertia::render("Gudang/WelcomeGudang");
    }
    public function login()
    {
        return Inertia::render("Gudang/LoginGudang");
    }
    public function register()
    {
        return Inertia::render("Gudang/SignUpGudang");
    }
    public function dashboard()
    {
        return Inertia::render("Gudang/Auth/Dashboard");
    }
    public function produkMasuk()
    {
        return Inertia::render("Gudang/Auth/KonfirmasiProduk");
    }
    public function produkKeluar()
    {
        return Inertia::render("Gudang/Auth/ProdukKeluar");
    }
    public function pesanMasuk()
    {
        return Inertia::render("Gudang/Auth/PesanMasuk");
    }
    public function bahanBaku()
    {
        return Inertia::render("Gudang/Auth/BahanBaku");
    }
    public function laporanGudang()
    {
        return Inertia::render("Gudang/Auth/LaporanGudang");
    }

    // crud gudang

    public function laporanGudangUpdate(Request $request, String $id)
    {
        $validated = $request->validate([
            "tanggal_penerimaan_produk" => "required",
            "jumlah_produk_diterima" => "required",
        ]);
        $produkMasuk = DataProdukMasuk::findOrFail($id);
        $produkMasuk->update($validated);
        $produkMasuk->status_penerimaan_produk = "diterima";
        $produkMasuk->save();
        $produk = Produk::findOrFail($produkMasuk->produk_id);
        $produk->stok_produk += $validated["jumlah_produk_diterima"];
        $produk->save();
        return Inertia::location("/produk-masuk-gudang");
    }
    public function laporanGudangUpdateEdit(Request $request, String $id)
    {
        $validated = $request->validate([
            "tanggal_penerimaan_produk" => "required|date",
            "jumlah_produk_diterima" => "required|numeric|min:0",
            "jumlah_produk_ditolak" => "required|numeric|min:0",
        ]);

        $produkMasuk = DataProdukMasuk::findOrFail($id);
        $produkMasuk->update($validated);
        $produkMasuk->status_penerimaan_produk = "diupdate";
        $produkMasuk->save();

        $produk = Produk::findOrFail($produkMasuk->produk_id);
        $produk->stok_produk -= $validated["jumlah_produk_ditolak"];

        $produk->save();

        return Inertia::location("/produk-masuk-gudang");
    }

    public function createBahanBaku(Request $request)
    {
        $validated = $request->validate([
            "id_bahan_baku" => "required",
            "nama_bahan_baku" => "required",
            "stok_bahan_baku" => "required",
            "minimum_stok" => "required",
            "satuan_bahan_baku" => "required",
            "harga_bahan_baku" => "required",
            "user_id" => "required",

        ]);
        $validated['id_bahan_baku'] = 'BHBK-' . $validated['id_bahan_baku'];
        $existingRecord = BahanBaku::where('id_bahan_baku', $validated['id_bahan_baku'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id bahan baku sudah ada, gagal menambahkan data bahan baku!, coba dengan id bahan baku yang berbeda']);
        }

        BahanBaku::create($validated);
        return Inertia::location("/bahan-baku-gudang");
    }
    public function updateBahanBaku(Request $request, String $id)
    {
        $validated = $request->validate([
            "id_bahan_baku" => "required",
            "nama_bahan_baku" => "required",
            "satuan_bahan_baku" => "required",
            "harga_bahan_baku" => "required",
            "minimum_stok" => "required",

        ]);
        $bahanBaku = BahanBaku::findOrFail($id);
        $bahanBaku->update($validated);
        return Inertia::location("/bahan-baku-gudang");
    }
    public function updateStokBahanBaku(Request $request, String $id)
    {
        $validated = $request->validate([
            "stok_masuk" => "required",
            'tanggal_masuk' => "required",

        ]);
        $bahanBaku = BahanBaku::findOrFail($id);
        $bahanBaku->stok_bahan_baku += $validated["stok_masuk"];
        $bahanBaku->save();
        $userId = Auth::id();
        DataBahanBakuMasuk::create([
            'id_bahan_baku' => $bahanBaku->id_bahan_baku,
            'jumlah_bahan_baku_masuk' => $validated["stok_masuk"],
            'tanggal_masuk' => $validated["tanggal_masuk"],
            'bahan_baku_id' => $bahanBaku->id,
            'user_id' => $userId,
        ]);
        return Inertia::location("/bahan-baku-gudang");
    }

    public function deleteBahanBaku(String $id)
    {
        $bahanBaku = BahanBaku::findOrFail($id);
        $bahanBaku->delete();
        return Inertia::location("/bahan-baku-gudang");
    }
}
