import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import ChartProduksi from "@/Pages/Produksi/Layouts/ChartProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import PrimaryButton from "@/Components/PrimaryButton";
import FormateDate from "@/Components/FormateDate";
import Table from "@/Layouts/Tabel";
import _ from "lodash";
import HeaderLaporan from "@/Pages/Produksi/Layouts/HeaderLaporan";
import PopOver from "@/Components/PopOver";
import CreateProdukMasuk from "@/Pages/Produksi/Layouts/CreateProdukMasuk";

function Dashboard({ auth }) {
    const [view, setView] = useState("diagram");
    const [dataLaporanProduksi, setDataLaporanProduksi] = useState([]);
    const [dataLaporanProduksiSuccess, setDataLaporanProduksiSuccess] =
        useState([]);
    const [dataProduksiDetail, setDataProduksiDetail] = useState([]);
    const [dataLaporanDetail, setDataLaporanDetail] = useState([]);
    const [dataProduksiDetailBahanBaku, setDataProduksiDetailBahanBaku] =
        useState([]);
    const [dataProduksiBahanBaku, setDataProduksiBahanBaku] = useState([]);
    const [namaPembuat, setNamaPembuat] = useState("");
    const [idLaporan, setIdLaporan] = useState(null);
    const [idProduksi, setIdProduksi] = useState(null);
    const [kirimProduk, setKirimProduk] = useState(false);
    const [createLaporan, setCreateLaporan] = useState(false);
    const handleViewChange = (selectedView) => {
        setView(selectedView);
    };

    useEffect(() => {
        const fetchDataProduksi = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis-verified"
            );
            setDataLaporanProduksi(response.data);
        };
        const fetchDataProduksiSuccess = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis-verified-success"
            );
            setDataLaporanProduksiSuccess(response.data);
        };
        const fetchDataProduksiBahanBaku = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produksis"
            );
            setDataProduksiBahanBaku(response.data);
        };
        if (idProduksi !== null) {
            const fetchDataPrduksiDetail = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/produksi/${idProduksi}`
                );
                setDataProduksiDetail(response.data);
                setNamaPembuat(response.data.user.name);
            };
            fetchDataPrduksiDetail();
        }
        if (idLaporan !== null) {
            const fetchDataLaporanDetail = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/laporan-produksi/${idLaporan}`
                );
                setDataLaporanDetail(response.data);
                setNamaPembuat(response.data.user.name);
            };
            fetchDataLaporanDetail();
        }
        if (idLaporan !== null) {
            const fetchDataPrduksiDetailBahanBaku = async () => {
                const response = await axios.get(
                    "/api/bintangsepatu/data-laporan-produksis"
                );
                setDataProduksiDetailBahanBaku(response.data);
                setNamaPembuat(response.data.user.name);
            };
            fetchDataPrduksiDetailBahanBaku();
        }
        fetchDataProduksiBahanBaku();
        fetchDataProduksi();
        fetchDataProduksiSuccess();
    }, [idLaporan, idProduksi]);
    const groupedData = _.chain(dataProduksiBahanBaku)
        .filter((i) => i.produksi_id === dataProduksiDetail.id)
        .groupBy("bahan.id_bahan_baku")
        .map((items, id_bahan_baku) => {
            const firstItem = items[0];
            const jumlah_bahan_baku = _.sumBy(items, "jumlah_bahan_baku");
            const harga_bahan_baku = firstItem.bahan.harga_bahan_baku;

            return {
                id_bahan_baku,
                nama_bahan_baku: firstItem.bahan.nama_bahan_baku,
                harga_bahan_baku,
                stok_bahan_baku: firstItem.stok_awal,
                jumlah_bahan_baku,
                sub_total: jumlah_bahan_baku * harga_bahan_baku,
                sisa: firstItem.stok_awal - jumlah_bahan_baku,
                stok_sekarang: firstItem.bahan.stok_bahan_baku,
            };
        })
        .value();
    const totalBiaya = _.reduce(
        groupedData,
        (sum, item) => sum + item.sub_total,
        0
    );
    const groupedDataSisaBahanBaku = _.chain(dataProduksiDetailBahanBaku)
        .filter((i) => i.laporan_id === idLaporan)
        .groupBy("bahan.id_bahan_baku")
        .map((items, id_bahan_baku) => {
            const firstItem = items[0];
            const jumlah_bahan_baku = _.sumBy(items, "pemakaian_bahan_baku");
            const harga_bahan_baku = firstItem.bahan.harga_bahan_baku;

            return {
                id_bahan_baku,
                nama_bahan_baku: firstItem.bahan.nama_bahan_baku,
                harga_bahan_baku,
                stok_bahan_baku: firstItem.jumlah_bahan_baku,
                jumlah_bahan_baku,
                sub_total: jumlah_bahan_baku * harga_bahan_baku,
                sisa: firstItem.jumlah_bahan_baku - jumlah_bahan_baku,
                stok_sekarang: firstItem.bahan.stok_bahan_baku,
            };
        })
        .value();
    const totalBiayaSisaBahanBaku = _.reduce(
        groupedDataSisaBahanBaku,
        (sum, item) => sum + item.sub_total,
        0
    );
    const akumulasiBiayaproduksi = totalBiaya - totalBiayaSisaBahanBaku;

    const handleLaporan = (idLaporan, idProduksi) => {
        setIdLaporan(idLaporan);
        setIdProduksi(idProduksi);
        setKirimProduk(true);
    };
    const handleCreateLaporanProduk = () => {
        setCreateLaporan(true);
    };
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar navbar={navbarProduksi} title={"Dashboard Produksi"}>
                <div className="flex justify-between">
                    <div
                        className={`w-full m-10 ml-20 ${
                            kirimProduk ? "hidden" : "block"
                        }`}
                    >
                        <div className="mb-10 h-screen overflow-auto">
                            <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                                <Label
                                    className={"bg-green-500"}
                                    rotate={"rotate-90"}
                                />
                                <h1 className="font-bold">
                                    Dashboard tim produksi
                                </h1>
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <div className="mb-10 flex uppercase gap-5 text-[10px]">
                                        <p
                                            className={`cursor-pointer w-20 text-center p-1 rounded-md border border-dashed border-green-500 hover:text-green-500 ${
                                                view === "diagram"
                                                    ? "text-green-500 bg-green-500/20 font-bold"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleViewChange("diagram")
                                            }
                                        >
                                            Diagram
                                        </p>
                                        <p
                                            className={`cursor-pointer w-20 text-center p-1 rounded-md border border-dashed border-green-500 hover:text-green-500 ${
                                                view === "tabel"
                                                    ? "text-green-500 bg-green-500/20 font-bold"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleViewChange("tabel")
                                            }
                                        >
                                            Tabel
                                        </p>
                                    </div>
                                </div>

                                {!kirimProduk &&
                                    dataLaporanProduksiSuccess.length > 0 && (
                                        <div>
                                            {view === "diagram" ? (
                                                <ChartProduksi
                                                    analisis={
                                                        dataLaporanProduksiSuccess
                                                    }
                                                />
                                            ) : (
                                                <div className="mb-32">
                                                    <Table
                                                        header={[
                                                            "no",
                                                            "tanggal",
                                                            "id laporan",
                                                            "id produk",
                                                            "id produksi",
                                                            "nama produk",
                                                            "qty",
                                                            "status",
                                                        ]}
                                                    >
                                                        {dataLaporanProduksiSuccess.map(
                                                            (i, index) => (
                                                                <tr
                                                                    key={i.id}
                                                                    className="border"
                                                                >
                                                                    <td className="border px-3 py-2 text-center">
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        <FormateDate
                                                                            data={
                                                                                i.tanggal_selesai
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        {
                                                                            i.id_laporan
                                                                        }
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        {
                                                                            i.id_produk
                                                                        }
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        {
                                                                            i.id_produksi
                                                                        }
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        {
                                                                            i
                                                                                .produk
                                                                                .nama_produk
                                                                        }
                                                                    </td>
                                                                    <td className="border px-3 py-2">
                                                                        {
                                                                            i.jumlah_produksi
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2 flex justify-between items-center">
                                                                        <p>
                                                                            {
                                                                                i.status_pengiriman
                                                                            }
                                                                        </p>
                                                                        <div
                                                                            className="hover:bg-green-500/20 p-1 cursor-pointer rounded-sm"
                                                                            onClick={() =>
                                                                                handleLaporan(
                                                                                    i.id,
                                                                                    i.produksi_id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Label
                                                                                className={
                                                                                    "bg-green-500"
                                                                                }
                                                                                rotate={
                                                                                    "rotate-90"
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </Table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    {kirimProduk && (
                        <div className="mx-5 pl-[60px] mt-10">
                            <div className="w-full h-screen pb-32 overflow-auto">
                                <div className="">
                                    <div className="hover:border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5">
                                        <div className="flex justify-end mb-2">
                                            <div
                                                className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                                onClick={() =>
                                                    setKirimProduk(false)
                                                }
                                            >
                                                <img
                                                    src="/assets/icons/plus.png"
                                                    alt=""
                                                    className="w-3 h-3 rotate-45"
                                                />
                                            </div>
                                        </div>
                                        <HeaderLaporan />
                                        <h1 className="font-black uppercase text-center mb-5 text-xs border-b-4 pb-3 border-black border-double">
                                            Nomor laporan:{" "}
                                            {dataLaporanDetail.id_laporan}/
                                            {dataLaporanDetail.id}/
                                            {dataLaporanDetail.id_produksi}/
                                            {dataLaporanDetail.id_produk}/
                                            {dataLaporanDetail.jumlah_produksi}
                                        </h1>
                                        <div>
                                            <div className="flex justify-between text-xs">
                                                <p>Produk:</p>
                                                <p>Produksi:</p>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed">
                                                <h1 className="font-black py-2">
                                                    ID:{" "}
                                                    {
                                                        dataProduksiDetail.id_produk
                                                    }
                                                </h1>
                                                <h1 className="font-black py-2">
                                                    ID:{" "}
                                                    {
                                                        dataProduksiDetail.id_produksi
                                                    }
                                                </h1>
                                            </div>
                                            <div>
                                                <Label
                                                    className={"bg-red-500"}
                                                />
                                                <p className="capitalize">
                                                    {
                                                        dataProduksiDetail.nama_produk
                                                    }
                                                    <span className="bg-purple-500/20 text-purple-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                                        {
                                                            dataProduksiDetail.status_produksi
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        Tanggal Mulai: <br />
                                                        <span className="font-bold">
                                                            <FormateDate
                                                                data={
                                                                    dataProduksiDetail.tanggal_mulai
                                                                }
                                                            />
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        Estimasi Selesai: <br />
                                                        <span className="font-bold">
                                                            <FormateDate
                                                                data={
                                                                    dataProduksiDetail.estimasi_selesai
                                                                }
                                                            />
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        QTY: <br />
                                                        <span className="font-bold">
                                                            {
                                                                dataProduksiDetail.jumlah_produksi
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 mb-5">
                                            <h1 className="font-black uppercase bg-pink-500/20 text-center p-2 border border-dashed border-pink-500 rounded-md">
                                                penggunaan bahan baku
                                            </h1>
                                        </div>
                                        <Table
                                            header={[
                                                "no",
                                                "id bahan baku",
                                                "nama bahan baku",
                                                "stok sebelum",
                                                "penggunaan stok",
                                                "sisa stok",
                                                "stok sekarang",
                                                "harga bahan baku",
                                                "sub total",
                                            ]}
                                        >
                                            {groupedData.map((item, index) => (
                                                <tr
                                                    className=""
                                                    key={item.id_bahan_baku}
                                                >
                                                    <td className="px-3 py-2 border text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.id_bahan_baku}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.nama_bahan_baku}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.stok_bahan_baku}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.jumlah_bahan_baku}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.sisa}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {item.stok_sekarang}
                                                    </td>
                                                    <td className="px-3 py-2 border text-end">
                                                        <FormaterRupiah
                                                            number={
                                                                item.harga_bahan_baku
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border text-end">
                                                        <FormaterRupiah
                                                            number={
                                                                item.sub_total
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border">
                                                <td
                                                    colSpan={8}
                                                    className="text-end px-3 py-2"
                                                >
                                                    Total biaya produksi:
                                                </td>
                                                <td className="border px-3 py-2 text-end font-black text-blue-500">
                                                    <FormaterRupiah
                                                        number={totalBiaya}
                                                    />
                                                </td>
                                            </tr>
                                        </Table>
                                        <div className="mt-5 mb-5">
                                            <h1 className="font-black uppercase bg-yellow-500/20 text-center p-2 border border-dashed border-yellow-500 rounded-md">
                                                sisa bahan baku
                                            </h1>
                                        </div>
                                        <Table
                                            header={[
                                                "no",
                                                "id bahan baku",
                                                "nama bahan baku",
                                                "stok sebelum",
                                                "sisa stok",
                                                "penggunaan stok",
                                                "harga bahan baku",
                                                "sub total",
                                            ]}
                                        >
                                            {groupedDataSisaBahanBaku.map(
                                                (item, index) => (
                                                    <tr
                                                        className=""
                                                        key={item.id_bahan_baku}
                                                    >
                                                        <td className="px-3 py-2 border text-center">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-3 py-2 border">
                                                            {item.id_bahan_baku}
                                                        </td>
                                                        <td className="px-3 py-2 border">
                                                            {
                                                                item.nama_bahan_baku
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 border">
                                                            {
                                                                item.stok_bahan_baku
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 border">
                                                            {
                                                                item.jumlah_bahan_baku
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 border">
                                                            {item.sisa}
                                                        </td>
                                                        <td className="px-3 py-2 border text-end">
                                                            <FormaterRupiah
                                                                number={
                                                                    item.harga_bahan_baku
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border text-end">
                                                            <FormaterRupiah
                                                                number={
                                                                    item.sub_total
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            <tr className="border">
                                                <td
                                                    colSpan={7}
                                                    className="text-end px-3 py-2"
                                                >
                                                    Total pengembalian stok:
                                                </td>
                                                <td className="border px-3 py-2 text-end font-black text-blue-500">
                                                    <FormaterRupiah
                                                        number={
                                                            totalBiayaSisaBahanBaku
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </Table>

                                        <div className="mt-5 mb-5">
                                            <h1 className="font-black uppercase bg-green-500/20 text-center p-2 border border-dashed border-green-500 rounded-md">
                                                akumulasi biaya produksi
                                            </h1>
                                        </div>
                                        <Table
                                            header={[
                                                "biaya produksi awal",
                                                "biaya pengembalian stok",
                                                "biaya produksi akhir",
                                            ]}
                                        >
                                            <tr className="border">
                                                <td className="border">
                                                    <p className="text-end px-3 py-2 font-black text-blue-500">
                                                        <FormaterRupiah
                                                            number={totalBiaya}
                                                        />
                                                    </p>
                                                </td>
                                                <td className="border">
                                                    <p className="text-end px-3 py-2 font-black text-red-500">
                                                        <FormaterRupiah
                                                            number={
                                                                totalBiayaSisaBahanBaku
                                                            }
                                                        />
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="text-end px-3 py-2 font-black text-green-500">
                                                        <FormaterRupiah
                                                            number={
                                                                akumulasiBiayaproduksi
                                                            }
                                                        />
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr className="border">
                                                <td
                                                    colSpan={2}
                                                    className="text-end px-3 py-2"
                                                >
                                                    Total akhir biaya produksi:
                                                </td>
                                                <td className="border px-3 py-2 text-end font-black text-blue-500">
                                                    <FormaterRupiah
                                                        number={
                                                            akumulasiBiayaproduksi
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </Table>

                                        <div className="text-xs flex justify-end mt-5">
                                            <div>
                                                <p>Pembuat:</p>
                                                <p className="font-bold capitalize">
                                                    {namaPembuat}
                                                </p>
                                                <FormateDate
                                                    data={
                                                        dataLaporanDetail.tanggal_selesai
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {dataLaporanDetail.status_pengiriman ===
                                            "belum dikirim" && (
                                            <div
                                                className="flex justify-end mt-5"
                                                onClick={
                                                    handleCreateLaporanProduk
                                                }
                                            >
                                                <PrimaryButton>
                                                    kirim ke bagian gudang
                                                </PrimaryButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {createLaporan && (
                                    <PopOver>
                                        <div className="border border-dashed border-pink-500 p-5 rounded-md">
                                            <div className="flex justify-end mb-2">
                                                <div
                                                    className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                                    onClick={() =>
                                                        setCreateLaporan(false)
                                                    }
                                                >
                                                    <img
                                                        src="/assets/icons/plus.png"
                                                        alt=""
                                                        className="w-3 h-3 rotate-45"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <CreateProdukMasuk
                                                    idLaporan={
                                                        dataLaporanDetail.id_laporan
                                                    }
                                                    idProduk={
                                                        dataLaporanDetail.id_produk
                                                    }
                                                    idProduksi={
                                                        dataLaporanDetail.id_produksi
                                                    }
                                                    laporanId={
                                                        dataLaporanDetail.id
                                                    }
                                                    produksiId={
                                                        dataLaporanDetail.produksi_id
                                                    }
                                                    produkId={
                                                        dataLaporanDetail.produk_id
                                                    }
                                                    userId={auth.user.id}
                                                    jumlahProduksi={
                                                        dataLaporanDetail.jumlah_produksi
                                                    }
                                                    biayaAwalProduksi={
                                                        totalBiaya
                                                    }
                                                    biayaAkhirProduksi={
                                                        akumulasiBiayaproduksi
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </PopOver>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={`${kirimProduk ? "hidden" : "block"}`}>
                        <div className="w-64 h-screen bg-white p-5 pt-10 border-l overflow-auto">
                            <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                                <Label
                                    className={"bg-green-500"}
                                    rotate={"rotate-90"}
                                />
                                <h1 className="font-bold">
                                    Buat pengiriman produk
                                </h1>
                            </div>
                            <div className="flex flex-col gap-5 pb-32">
                                {dataLaporanProduksi.map((i) => (
                                    <div
                                        key={i.id}
                                        className="hover:border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <h1 className="font-bold p-2 border border-dashed border-green-500 rounded-md text-center bg-green-500/20">
                                            {i.id_laporan}
                                        </h1>
                                        <div>
                                            <h1 className="font-black border-b border-dashed py-2">
                                                ID: {i.id_produk}
                                            </h1>
                                            <div>
                                                <Label
                                                    className={"bg-green-500"}
                                                />
                                                <p className="capitalize">
                                                    {i.produk.nama_produk}
                                                    <span className="bg-red-500/20 text-red-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                                        {i.status_pengiriman}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed">
                                                <div>
                                                    <h1 className="font-black py-2">
                                                        ID: {i.id_produksi}
                                                    </h1>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        QTY: <br />
                                                        <span className="font-bold">
                                                            {i.jumlah_produksi}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-blue-500 font-black mt-2">
                                                    <Label
                                                        className={
                                                            "bg-green-500"
                                                        }
                                                    />
                                                    <FormaterRupiah
                                                        number={
                                                            i.biaya_produksi
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                            onClick={() =>
                                                handleLaporan(
                                                    i.id,
                                                    i.produksi_id
                                                )
                                            }
                                        >
                                            <img
                                                src="/assets/icons/plus.png"
                                                alt=""
                                                className="w-7 h-7 bg-green-300 p-2 rounded-md"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>
        </RoleAccess>
    );
}

export default Dashboard;
