import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import React from "react";

function CreateProdukMasuk({
    idLaporan,
    idProduksi,
    idProduk,
    laporanId,
    userId,
    produkId,
    produksiId,
    jumlahProduksi,
    biayaAwalProduksi,
    biayaAkhirProduksi,
}) {
    const tanggalPengiriman = new Date();
    const { data, setData, post } = useForm({
        id_produksi_masuk: "",
        id_laporan: idLaporan,
        id_produksi: idProduksi,
        id_produk: idProduk,
        tanggal_pengiriman_produk: tanggalPengiriman,
        jumlah_produksi: jumlahProduksi,
        biaya_awal_produksi: biayaAwalProduksi,
        biaya_akhir_produksi: biayaAkhirProduksi,
        laporan_id: laporanId,
        produksi_id: produksiId,
        produk_id: produkId,
        user_id: userId,
    });
    const handlePengirimanProduk = (e) => {
        e.preventDefault();
        post("/create-data-produk-masuk");
    };
    return (
        <div className="w-96">
            <form action="" onSubmit={handlePengirimanProduk}>
                <div className="my-3">
                    <InputLabel
                        htmlFor="id_produksi_masuk"
                        value="Id Pengiriman"
                    />
                    <TextInput
                        id="id_produksi_masuk"
                        type="text"
                        name="id_produksi_masuk"
                        value={data.id_produksi_masuk}
                        className="mt-1 block w-full"
                        autoComplete="id_produksi_masuk"
                        isFocused={true}
                        onChange={(e) =>
                            setData("id_produksi_masuk", e.target.value)
                        }
                    />
                    <InputError message={""} className="mt-2" />
                </div>
                <div className="mt-10 flex justify-end">
                    <PrimaryButton>Kirim</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default CreateProdukMasuk;
