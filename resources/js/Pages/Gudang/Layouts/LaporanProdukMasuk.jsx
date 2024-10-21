import FormateDate from "@/Components/FormateDate";
import Label from "@/Components/Label";
import Table from "@/Layouts/Tabel";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";

function LaporanProdukMasuk() {
    const tanggal = new Date();
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

    const filterProdukMasuk = _.filter(
        dataProdukMasuk,
        (item) => item.status_penerimaan_produk === "diupdate"
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
        <div className="">
            <div className="relative mb-10 border-b-4 border-black border-double pb-3">
                <div className="absolute top-2">
                    <img src="/assets/logo.png" alt="" className="w-8 h-8" />
                </div>
                <h1 className="font-black uppercase text-center text-xl">
                    laporan bagian gudang
                </h1>
                <h2 className="text-center font-bold text-sm">
                    Sistem Informasi Inventori dan Produksi (SIIP)
                </h2>
                <h2 className="text-center font-bold text-sm">
                    NOMOR: LAG-001/01/LAP-001/LAP-014
                </h2>
                <p className="absolute top-2 right-5 text-xs">
                    <FormateDate data={tanggal} />
                </p>
            </div>
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
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">
                            {i.id_produksi_masuk}
                        </td>
                        <td className="border px-3 py-2">{i.id_produk}</td>
                        <td className="border px-3 py-2">
                            {i.produk.nama_produk}
                        </td>
                        <td className="border px-3 py-2">
                            {i.jumlah_produksi}
                        </td>
                        <td className="border px-3 py-2">
                            <FormateDate data={i.tanggal_pengiriman_produk} />
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
                                    onClick={() => handleKonfirmasiUpdate(i.id)}
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
    );
}

export default LaporanProdukMasuk;
