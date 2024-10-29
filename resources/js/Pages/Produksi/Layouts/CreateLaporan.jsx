import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PopOver from "@/Components/PopOver";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect } from "react";

function CreateLaporan({ id, biayaProduksi }) {
    const status_produksi_sementara = "belum diverifikasi";
    const { data, setData, post, errors } = useForm({
        id_laporan: "",
        id_produk: "",
        id_produksi: id,
        tanggal_mulai: "",
        tanggal_selesai: "",
        estimasi_selesai: "",
        jumlah_produksi: "",
        biaya_produksi: biayaProduksi,
        penanggung_jawab_produksi: "",
        user_id: "",
        produk_id: "",
        produksi_id: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/bintangsepatu/produksi/${id}`
            );
            setData({
                id_produksi: response.data.id_produksi,
                id_produk: response.data.id_produk,
                tanggal_mulai: response.data.tanggal_mulai,
                estimasi_selesai: response.data.estimasi_selesai,
                jumlah_produksi: response.data.jumlah_produksi,
                penanggung_jawab_produksi: response.data.user.name,
                biaya_produksi: biayaProduksi,
                produksi_id: id,
                user_id: response.data.user.id,
                produk_id: response.data.produk_id,
            });
        };
        fetchData();
    }, [id, biayaProduksi, status_produksi_sementara]); // Added biayaProduksi as a dependency

    const handlesubmit = (e) => {
        e.preventDefault();
        post("/create-laporan-produksi");
    };

    return (
        <div className="mt-10 w-96 mx-auto">
            {errors.message && (
                <PopOver>
                    <div className="flex flex-col items-center bg-white p-5 rounded w-96">
                        <p className="text-center mb-5">{errors.message}</p>
                        <PrimaryButton onClick={() => window.location.reload()}>
                            Coba lagi
                        </PrimaryButton>
                    </div>
                </PopOver>
            )}
            <form
                className="shadow-lg p-5 rounded-lg border"
                onSubmit={handlesubmit}
            >
                <div className="w-full">
                    <div className="my-3">
                        <InputLabel htmlFor="id_laporan" value="Id Laporan" />
                        <TextInput
                            id="id_laporan"
                            type="text"
                            name="id_laporan"
                            value={data.id_laporan}
                            className="mt-1 block w-full"
                            autoComplete="id_laporan"
                            isFocused={true}
                            onChange={(e) =>
                                setData("id_laporan", e.target.value)
                            }
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3 hidden">
                        <InputLabel htmlFor="id_produk" value="Id Produk" />
                        <TextInput
                            id="id_produk"
                            type="text"
                            name="id_produk"
                            value={data.id_produk}
                            className="mt-1 block w-full"
                            autoComplete="id_produk"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3 hidden">
                        <InputLabel htmlFor="id_produksi" value="Id Produksi" />
                        <TextInput
                            id="id_produksi"
                            type="text"
                            name="id_produksi"
                            value={data.id_produksi}
                            className="mt-1 block w-full"
                            autoComplete="id_produksi"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                </div>
                <div className="w-full">
                    <div className="my-3 hidden">
                        <InputLabel
                            htmlFor="tanggal_mulai"
                            value="Tanggal Mulai"
                        />
                        <TextInput
                            id="tanggal_mulai"
                            type="date"
                            name="tanggal_mulai"
                            value={data.tanggal_mulai}
                            className="mt-1 block w-full"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3 hidden">
                        <InputLabel
                            htmlFor="estimasi_selesai"
                            value="Estimasi Selesai"
                        />
                        <TextInput
                            id="estimasi_selesai"
                            type="date"
                            name="estimasi_selesai"
                            value={data.estimasi_selesai}
                            className="mt-1 block w-full"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3">
                        <InputLabel
                            htmlFor="tanggal_selesai"
                            value="Tanggal Selesai"
                        />
                        <TextInput
                            id="tanggal_selesai"
                            type="date"
                            name="tanggal_selesai"
                            value={data.tanggal_selesai}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData("tanggal_selesai", e.target.value)
                            }
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                </div>
                <div className="w-full">
                    <div className="my-3 hidden">
                        <InputLabel
                            htmlFor="jumlah_produksi"
                            value="Jumlah Produksi"
                        />
                        <TextInput
                            id="jumlah_produksi"
                            type="number"
                            name="jumlah_produksi"
                            value={data.jumlah_produksi}
                            className="mt-1 block w-full"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3 hidden">
                        <InputLabel
                            htmlFor="penanggung_jawab_produksi"
                            value="Penanggung Jawab"
                        />
                        <TextInput
                            id="penanggung_jawab_produksi"
                            type="text"
                            name="penanggung_jawab_produksi"
                            value={data.penanggung_jawab_produksi}
                            className="mt-1 block w-full"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="my-3 hidden">
                        <InputLabel
                            htmlFor="biaya_produksi"
                            value="Biaya Produksi"
                        />
                        <TextInput
                            id="biaya_produksi"
                            type="number"
                            name="biaya_produksi"
                            value={data.biaya_produksi}
                            className="mt-1 block w-full"
                        />
                        <InputError message={""} className="mt-2" />
                    </div>
                    <div className="mt-10 flex justify-end">
                        <PrimaryButton>Kirim</PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateLaporan;
