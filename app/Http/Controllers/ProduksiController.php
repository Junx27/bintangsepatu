<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\CatatanProduksi;
use App\Models\CatatanStok;
use App\Models\DataLaporan;
use App\Models\DataLaporanProduksi;
use App\Models\DataProdukMasuk;
use App\Models\DataProduksi;
use App\Models\LaporanProduksi;
use App\Models\Produk;
use App\Models\Produksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            "gambar_produk" => 'required',
            "user_id" => 'required',
        ]);
        $validated['id_produk'] = 'PRDK-' . $validated['id_produk'];
        $existingRecord = Produk::where('id_produk', $validated['id_produk'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id produk sudah ada, gagal menambahkan data produk!, coba dengan id produk yang berbeda']);
        }
        if ($request->hasFile('gambar_produk')) {
            $validated['gambar_produk'] = $request->file('gambar_produk')->store('gambar_produk', 'public');
        }
        Produk::create($validated);
        return Inertia::location("/daftar-produk-produksi");
    }

    public function updateProduk(Request $request, String $id)
    {
        $validated = $request->validate([
            "id_produk" => 'required',
            "nama_produk" => 'required',
            "harga_produk" => 'required',
            "gambar_produk" => 'required',
        ]);
        $produk = Produk::findOrFail($id);
        $existingRecord = Produk::where('id_produk', $validated['id_produk'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id produk sudah ada, gagal menambahkan data produk!, coba dengan id produk yang berbeda']);
        }
        if ($request->hasFile('gambar_produk')) {
            if ($produk->gambar_produk) {
                Storage::disk('public')->delete($produk->gambar_produk);
            }
            $validated['gambar_produk'] = $request->file('gambar_produk')->store('gambar_produk', 'public');
        }

        $produk->update($validated);
        return Inertia::location("/daftar-produk-produksi");
    }

    public function deleteProduk(String $id)
    {
        $data = Produk::findOrFail($id);
        if ($data->gambar_produk) {
            Storage::disk('public')->delete($data->gambar_produk);
        }
        $data->delete();
        return Inertia::location("/daftar-produk-produksi");
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
        $validated['id_produksi'] = 'PRDKSI-' . $validated['id_produksi'];
        $existingRecord = Produksi::where('id_produksi', $validated['id_produksi'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id produksi sudah ada, gagal menambahkan data produksi!, coba dengan id produk yang berbeda']);
        }
        Produksi::create($validated);
        return Inertia::location("/daftar-produksi-produksi");
    }

    public function createDataProduksi(Request $request)
    {

        $validated = $request->validate([
            "produksi.*.stok_awal" => 'required|integer',
            "produksi.*.jumlah_bahan_baku" => 'required|integer',
            "produksi.*.bahan_baku_id" => "required|integer",
            "produksi.*.produksi_id" => "required|integer",
            "produksi.*.user_id" => "required|integer",
        ]);


        foreach ($validated['produksi'] as $produksi) {

            DataProduksi::create($produksi);


            $produk = BahanBaku::find($produksi['bahan_baku_id']);
            if ($produk) {
                if ($produk->stok_bahan_baku >= $produksi['jumlah_bahan_baku']) {
                    $produk->stok_bahan_baku -= $produksi['jumlah_bahan_baku'];
                    $produk->save();
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
    public function createSisaBahanBaku(Request $request)
    {
        $validated = $request->validate([
            "produksi.*.jumlah_bahan_baku" => 'required|integer',
            "produksi.*.pemakaian_bahan_baku" => 'required|integer',
            "produksi.*.sisa_bahan_baku" => 'required|integer',
            "produksi.*.bahan_baku_id" => "required|integer",
            "produksi.*.laporan_id" => "required|integer",
            "produksi.*.user_id" => "required|integer",
        ]);


        foreach ($validated['produksi'] as $produksi) {

            DataLaporanProduksi::create($produksi);


            $produk = BahanBaku::find($produksi['bahan_baku_id']);
            if ($produk) {
                $produk->stok_bahan_baku += $produksi['sisa_bahan_baku'];
                $produk->save();
            }
            $dataLaporan = LaporanProduksi::find($produksi['laporan_id']);
            if ($dataLaporan) {
                $dataLaporan->status_produksi = "diverifikasi";
                $dataLaporan->save();
            }
        }

        return Inertia::location("/dashboard-produksi");
        // dd($request->all());
    }

    public function createLaporan(Request $request)
    {
        $validated = $request->validate([
            "id_laporan" => "required",
            "id_produk" => "required",
            "id_produksi" => "required",
            "tanggal_mulai" => "required",
            "tanggal_selesai" => "required",
            "estimasi_selesai" => "required",
            "jumlah_produksi" => "required",
            "biaya_produksi" => "required",
            "penanggung_jawab_produksi" => "required",
            "user_id" => "required",
            "produk_id" => "required",
            "produksi_id" => "required",
        ]);
        $validated['id_laporan'] = 'LPRDKSI-' . $validated['id_laporan'];
        $existingRecord = LaporanProduksi::where('id_laporan', $validated['id_laporan'])->first();

        if ($existingRecord) {
            return back()->withErrors(['message' => 'Data id laporan sudah ada. Gagal menambahkan data laporan! Coba dengan id laporan yang berbeda.']);
        }

        $produksi = Produksi::findOrFail($validated["produksi_id"]);
        $produksi->status_produksi = "selesai";
        $produksi->save();


        LaporanProduksi::create($validated);
        return Inertia::location("/laporan-produksi");
    }

    public function createDataProdukMasuk(Request $request)
    {
        $validated = $request->validate([
            'id_produksi_masuk' => "required",
            'id_laporan' => "required",
            'id_produksi' => "required",
            'id_produk' => "required",
            'tanggal_pengiriman_produk' => "required",
            'jumlah_produksi' => "required",
            'biaya_awal_produksi' => "required",
            'biaya_akhir_produksi' => "required",
            'laporan_id' => "required",
            'produksi_id' => "required",
            'produk_id' => "required",
            'user_id' => "required",
        ]);
        $validated['id_produksi_masuk'] = 'PKRM-' . $validated['id_produksi_masuk'];
        $laporan = LaporanProduksi::findOrFail($validated["laporan_id"]);

        if ($laporan) {
            $laporan->status_pengiriman = "terkirim";
            $laporan->save();
        }

        DataProdukMasuk::create($validated);
        return Inertia::location("/dashboard-produksi");
        // dd($request->all());
    }
}
