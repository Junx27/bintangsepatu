<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\CatatanProduksi;
use App\Models\CatatanStok;
use App\Models\DataProduksi;
use App\Models\Produk;
use App\Models\Produksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduksiController extends Controller
{
    public function index()
    {
        return Inertia::render("Produksi/WelcomeProduksi");
    }
    public function login()
    {
        return Inertia::render("Produksi/LoginProduksi");
    }
    public function register()
    {
        return Inertia::render("Produksi/SignUpProduksi");
    }
    public function dashboard()
    {
        return Inertia::render("Produksi/Auth/Dashboard");
    }
    public function daftarPesanan()
    {
        return Inertia::render("Produksi/Auth/DaftarPesanan");
    }
    public function daftarProduksi()
    {
        return Inertia::render("Produksi/Auth/DaftarProduksi");
    }
    public function daftarStok()
    {
        return Inertia::render("Produksi/Auth/DaftarStok");
    }
    public function daftarRepair()
    {
        return Inertia::render("Produksi/Auth/DaftarRepair");
    }
    public function daftarProduk()
    {
        return Inertia::render("Produksi/Auth/DaftarProduk");
    }
    public function laporan()
    {
        return Inertia::render("Produksi/Auth/LaporanProduksi");
    }

    //data CRUD produksi

    public function createProduk(Request $request)
    {
        $validated = $request->validate([
            "id_produk" => 'required',
            "nama_produk" => 'required',
            "harga_produk" => 'required',
            "user_id" => 'required',
        ]);
        $existingRecord = Produk::where('id_produk', $validated['id_produk'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id produk sudah ada, gagal menambahkan data produk!, coba dengan id produk yang berbeda']);
        }
        Produk::create($validated);
        return Inertia::location("/daftar-produk-produksi");
    }
    public function deleteProduk(String $id)
    {
        $data = Produk::findOrFail($id);

        $data->delete();
        return Inertia::location("/daftar-produk-produksi");
    }

    public function createCatatanProduk(Request $request)
    {
        $validated = $request->validate([
            "catatan" => 'required',
            "user_id" => 'required',
            "produk_id" => 'required',
        ]);
        CatatanProduksi::create($validated);
        return Inertia::location("/daftar-produk-produksi");
    }
    public function createCatatanStok(Request $request)
    {
        $validated = $request->validate([
            "catatan" => 'required',
            "user_id" => 'required',
            "bahan_baku_id" => 'required',
        ]);
        CatatanStok::create($validated);
        return Inertia::location("/daftar-stok-produksi");
    }

    public function createProduksi(Request $request)
    {

        $validated = $request->validate([
            "id_produksi" => 'required',
            "id_produk" => 'required',
            "nama_produk" => 'required',
            "jumlah_produksi" => 'required',
            "tanggal_mulai" => 'required',
            "estimasi_selesai" => 'required',
            "status_produksi" => "required",
            "user_id" => 'required',
            "produk_id" => 'required',

        ]);
        $existingRecord = Produksi::where('id_produksi', $validated['id_produksi'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id produksi sudah ada, gagal menambahkan data produksi!, coba dengan id produk yang berbeda']);
        }
        // $existingPending = Produksi::where('status_produksi', "persiapan")->first();

        // if ($existingPending) {
        //     return back()->withErrors(['message' => 'Data produksi belum selesai, gagal menambahkan data produksi!, coba dengan selsaikan proses produksi']);
        // }
        Produksi::create($validated);
        return Inertia::location("/daftar-produksi-produksi");
    }

    public function createDataProduksi(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            "produksi.*.jumlah_bahan_baku" => 'required|integer',
            "produksi.*.bahan_baku_id" => "required|integer",
            "produksi.*.produksi_id" => "required|integer",
            "produksi.*.user_id" => "required|integer",
        ]);

        // Loop melalui setiap entri produksi
        foreach ($validated['produksi'] as $produksi) {
            // Simpan data produksi
            DataProduksi::create($produksi);

            // Update stok produk berdasarkan ID produk
            $produk = BahanBaku::find($produksi['bahan_baku_id']);
            if ($produk) {
                if ($produk->stok_bahan_baku >= $produksi['jumlah_bahan_baku']) {
                    $produk->stok_bahan_baku -= $produksi['jumlah_bahan_baku']; // Kurangi stok
                    $produk->save(); // Simpan perubahan
                } else {
                    return response()->json(['message' => 'Stok tidak cukup untuk produk ID ' . $produksi['produksi_id']], 400);
                }
            }
            $dataProduksi = Produksi::find($produksi['produksi_id']);
            if ($dataProduksi) {
                $dataProduksi->status_produksi = "diproses";
                $dataProduksi->save();
            }
        }

        return Inertia::location("/laporan-produksi");
    }
}
