import FormateDate from "@/Components/FormateDate";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Label from "@/Components/Label";
import PopOver from "@/Components/PopOver";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Table from "@/Layouts/Tabel";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function DataProdukMasuk() {
    const [idProdukMasuk, setIdProdukMasuk] = useState(null);
    const [validasi, setValidasi] = useState(0);
    const [konfirmasiProduk, setKonfirmasiProduk] = useState(false);
    const [dataProdukMasuk, setDataProdukMasuk] = useState([]);
    const [localErrors, setLocalErrors] = useState({});
    const { data, setData, put } = useForm({
        tanggal_penerimaan_produk: "",
        jumlah_produk_diterima: "",
        jumlah_produk_ditolak: "",
    });

    const filterProdukMasuk = dataProdukMasuk.filter(
        (item) => item.status_penerimaan_produk === "diterima"
    );

    useEffect(() => {
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProdukMasuk(response.data);
        };

        fetchDataProdukMasuk();

        if (idProdukMasuk !== null) {
            const fetchDataProdukMasukDetail = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/data-produk-masuk-gudang/${idProdukMasuk}`
                );
                setData({
                    tanggal_penerimaan_produk:
                        response.data.tanggal_penerimaan_produk,
                    jumlah_produk_diterima:
                        response.data.jumlah_produk_diterima,
                    jumlah_produk_ditolak: response.data.jumlah_produk_ditolak,
                });
                setValidasi(response.data.jumlah_produksi);
            };
            fetchDataProdukMasukDetail();
        }
    }, [idProdukMasuk]);

    useEffect(() => {
        const jumlahDiterima =
            validasi - parseInt(data.jumlah_produk_ditolak || 0);
        setData("jumlah_produk_diterima", jumlahDiterima);
    }, [data.jumlah_produk_ditolak]);

    const handleKonfirmasiUpdate = (id) => {
        setIdProdukMasuk(id);
        setKonfirmasiProduk(true);
        setLocalErrors({});
    };

    const submitProdukMasuk = (e) => {
        e.preventDefault();

        const { jumlah_produk_diterima, jumlah_produk_ditolak } = data;
        const total =
            parseInt(jumlah_produk_ditolak) + parseInt(jumlah_produk_diterima);

        let errors = {};

        if (
            parseInt(jumlah_produk_ditolak) >= parseInt(jumlah_produk_diterima)
        ) {
            errors.jumlah_produk_ditolak =
                "Jumlah produk ditolak harus lebih kecil dari jumlah produk diterima.";
        }
        if (total !== validasi) {
            errors.jumlah_produk_ditolak =
                "Jumlah harus sama dengan jumlah produksi.";
        }

        if (Object.keys(errors).length > 0) {
            setLocalErrors(errors);
            return;
        }

        put(`/laporan-gudang-edit/${idProdukMasuk}`, {
            onSuccess: () => {
                setLocalErrors({});
                setKonfirmasiProduk(false);
            },
            onError: (err) => {
                setLocalErrors(err);
            },
        });
    };

    const handleClose = () => {
        setKonfirmasiProduk(false);
        setLocalErrors({});
    };

    return (
        <div>
            {filterProdukMasuk.length === 0 ? (
                <div className="mt-20">
                    <img
                        src="/assets/icons/no-document.png"
                        alt=""
                        className="w-10 h-10 mx-auto"
                    />
                    <h1 className="text-xs text-red-500 text-center mt-5">
                        Belum ada data produk verifikasi
                    </h1>
                </div>
            ) : (
                <div className={`${konfirmasiProduk ? "hidden" : "block"}`}>
                    <Table
                        header={[
                            "no",
                            "id produksi masuk",
                            "id produk",
                            "nama produk",
                            "jumlah",
                            "tanggal pengiriman",
                            "tanggal penerimaan",
                            "diterima (qty)",
                            "ditolak (qty)",
                        ]}
                    >
                        {filterProdukMasuk.map((i, index) => (
                            <tr key={i.id}>
                                <td className="border px-3 py-2">
                                    {index + 1}
                                </td>
                                <td className="border px-3 py-2">
                                    {i.id_produksi_masuk}
                                </td>
                                <td className="border px-3 py-2">
                                    {i.id_produk}
                                </td>
                                <td className="border px-3 py-2">
                                    {i.produk.nama_produk}
                                </td>
                                <td className="border px-3 py-2">
                                    {i.jumlah_produksi}
                                </td>
                                <td className="border px-3 py-2">
                                    <FormateDate
                                        data={i.tanggal_pengiriman_produk}
                                    />
                                </td>
                                <td className="border px-3 py-2">
                                    {i.tanggal_penerimaan_produk === null ? (
                                        "-"
                                    ) : (
                                        <FormateDate
                                            data={i.tanggal_penerimaan_produk}
                                        />
                                    )}
                                </td>
                                <td className="border px-3 py-2">
                                    {i.jumlah_produk_diterima}
                                </td>
                                <td className="border px-3 py-2">
                                    <div className="flex justify-between items-center">
                                        <p>
                                            {i.jumlah_produk_ditolak === 0
                                                ? "-"
                                                : i.jumlah_produk_ditolak}
                                        </p>
                                        <div
                                            className="hover:bg-blue-50 p-2 cursor-pointer rounded-md"
                                            onClick={() =>
                                                handleKonfirmasiUpdate(i.id)
                                            }
                                        >
                                            <Label
                                                className={"bg-red-500"}
                                                rotate={"rotate-90"}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            )}
            {konfirmasiProduk && (
                <div className="border cursor-pointer relative group shadow-lg rounded-xl p-5 w-72">
                    <div className="flex justify-end mb-2">
                        <div
                            className="bg-pink-400 p-2 rounded-md text-center cursor-pointer w-7"
                            onClick={handleClose}
                        >
                            <img
                                src="/assets/icons/plus.png"
                                alt=""
                                className="w-3 h-3 rotate-45"
                            />
                        </div>
                    </div>
                    {localErrors.jumlah_produk_ditolak && (
                        <p className="text-center mb-5 text-xs text-red-500 absolute -top-12 left-5">
                            {localErrors.jumlah_produk_ditolak}
                        </p>
                    )}
                    {localErrors.message && (
                        <p className="text-center mb-5 text-xs text-red-500 absolute -top-12 left-5">
                            {localErrors.message}
                        </p>
                    )}
                    <form onSubmit={submitProdukMasuk}>
                        <div className="my-3 mt-4">
                            <InputLabel
                                htmlFor="tanggal_penerimaan_produk"
                                value="Tanggal Penerimaan"
                            />
                            <TextInput
                                id="tanggal_penerimaan_produk"
                                type="date"
                                name="tanggal_penerimaan_produk"
                                value={data.tanggal_penerimaan_produk}
                                className="mt-1 block w-full"
                                autoComplete="tanggal_penerimaan_produk"
                                isFocused={true}
                                onChange={(e) =>
                                    setData(
                                        "tanggal_penerimaan_produk",
                                        e.target.value
                                    )
                                }
                            />
                            <InputError
                                message={localErrors.tanggal_penerimaan_produk}
                                className="mt-2"
                            />
                        </div>
                        <div className="my-3">
                            <InputLabel
                                htmlFor="jumlah_produk_diterima"
                                value="Produk Diterima"
                            />
                            <TextInput
                                id="jumlah_produk_diterima"
                                type="number"
                                name="jumlah_produk_diterima"
                                value={data.jumlah_produk_diterima}
                                className="mt-1 block w-full"
                                autoComplete="jumlah_produk_diterima"
                                readOnly
                            />
                            <InputError
                                message={localErrors.jumlah_produk_diterima}
                                className="mt-2"
                            />
                        </div>
                        <div className="my-3">
                            <InputLabel
                                htmlFor="jumlah_produk_ditolak"
                                value="Produk Ditolak"
                            />
                            <TextInput
                                id="jumlah_produk_ditolak"
                                type="number"
                                name="jumlah_produk_ditolak"
                                value={data.jumlah_produk_ditolak}
                                className="mt-1 block w-full"
                                autoComplete="jumlah_produk_ditolak"
                                isFocused={true}
                                onChange={(e) =>
                                    setData(
                                        "jumlah_produk_ditolak",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <PrimaryButton>
                                verifikasi produk masuk
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DataProdukMasuk;
