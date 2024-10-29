import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import _ from "lodash";
import Table from "@/Layouts/Tabel";
import FormateDate from "@/Components/FormateDate";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateLaporan from "@/Pages/Produksi/Layouts/CreateLaporan";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import VerifikasiLaporan from "@/Pages/Produksi/Layouts/VerifikasiLaporan";
import NavbarProduksi from "../Layouts/NavbarProduksi";
import Notification from "@/Components/Notification";

function LaporanProduksi({ auth }) {
    const navigasi = [
        {
            nama: "data semua produk diproses",
            icon: "/assets/icons/list-product.png",
        },
        {
            nama: "verifikasi produksi selesai",
            icon: "/assets/icons/correct.png",
        },
    ];
    const [view, setView] = useState("data semua produk diproses");
    const [dataProduksi, setDataProduksi] = useState([]);
    const [dataLaporanProduksi, setDataLaporanProduksi] = useState([]);
    const [dataProduksiBahanBaku, setDataProduksiBahanBaku] = useState([]);
    const [dataProduksiDetail, setDataProduksiDetail] = useState([]);
    const [id, setId] = useState(null);
    const [idLaporan, setIdLaporan] = useState(null);
    const [updateProduksi, setUpdateProduksi] = useState(false);
    const [namaPembuat, setNamaPembuat] = useState("");
    const [produksiId, setProduksiId] = useState(null);
    const [createLaporan, setCreateLaporan] = useState(false);
    const [createLaporanVerifikasi, setCreateLaporanVerifikasi] =
        useState(false);

    useEffect(() => {
        const fetchDataProduksi = async () => {
            const response = await axios.get("/api/bintangsepatu/produksis");
            setDataProduksi(response.data);
        };
        const fetchDataProduksiBahanBaku = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produksis"
            );
            setDataProduksiBahanBaku(response.data);
        };
        const fetchDataLaporanProduksi = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis"
            );
            setDataLaporanProduksi(response.data);
        };
        if (id !== null) {
            const fetchDataPrduksiDetail = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/produksi/${id}`
                );
                setDataProduksiDetail(response.data);
                setNamaPembuat(response.data.user.name);
            };
            fetchDataPrduksiDetail();
        }
        fetchDataLaporanProduksi();
        fetchDataProduksiBahanBaku();
        fetchDataProduksi();
    }, [id]);
    const handleBahanBaku = (id) => {
        setId(id);
        setUpdateProduksi(true);
    };
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

    const handleSubmit = () => {};
    const handleLaporan = (id) => {
        setProduksiId(id);
        setCreateLaporan(true);
    };
    const handleVerifikasiLaporan = (id, produksiId) => {
        setIdLaporan(id);
        setProduksiId(produksiId);
        setCreateLaporanVerifikasi(true);
    };
    const filterBahanBaku = dataProduksiBahanBaku.filter(
        (item) => item.produksi_id === produksiId
    );
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <NavbarProduksi
                navbar={navbarProduksi}
                title={"Laporan Produksi"}
                auth={auth}
            >
                <div className="m-5 ml-20 h-screen overflow-auto pb-32">
                    <div className="sticky top-0 z-30 text-sm mb-5 flex gap-2 items-center bg-white w-full py-2">
                        <Label
                            className={"bg-[#0C15F7]"}
                            rotate={"rotate-90"}
                        />
                        {navigasi.map((item) => (
                            <div
                                key={item}
                                className={`relative text-[8px] p-2 px-3 rounded-md cursor-pointer mr-5 text-center hover:bg-blue-50 overflow-hidden ${
                                    view === item.nama ? "bg-blue-50" : ""
                                }`}
                                onClick={() => setView(item.nama)}
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <img
                                        src={item.icon}
                                        alt=""
                                        className="w-4 h-4"
                                    />
                                    <p className="">
                                        {item.nama.charAt(0).toUpperCase() +
                                            item.nama.slice(1)}
                                    </p>
                                    <div
                                        className={`absolute top-8 w-full h-2 -ml-3 bg-[#0C15F7] transition-opacity duration-300 ${
                                            view === item.nama
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    ></div>
                                </div>
                                <Notification
                                    nama={item.nama}
                                    parameter={"data semua produk diproses"}
                                    data={dataProduksi}
                                />
                                <Notification
                                    nama={item.nama}
                                    parameter={"verifikasi produksi selesai"}
                                    data={dataLaporanProduksi}
                                />
                            </div>
                        ))}
                    </div>
                    {view === "data semua produk diproses" ? (
                        <div
                            className={`mt-5 ${
                                createLaporanVerifikasi ? "hidden" : "block"
                            }`}
                        >
                            <div
                                className={`grid grid-cols-4 gap-5 pb-32 ${
                                    updateProduksi ? "hidden" : "block"
                                }`}
                            >
                                {dataProduksi.map((i) => (
                                    <div
                                        key={i.id}
                                        className="cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <h1 className="font-black uppercase bg-pink-500/20 text-center p-2 rounded-md">
                                            {i.id_produksi}
                                        </h1>
                                        <div>
                                            <h1 className="font-black border-b border-dashed py-2">
                                                ID: {i.id_produk}
                                            </h1>
                                            <div>
                                                <Label
                                                    className={"bg-red-500"}
                                                />
                                                <p className="capitalize">
                                                    {i.nama_produk}
                                                    <span className="bg-purple-500/20 text-purple-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                                        {i.status_produksi}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="flex justify-between">
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        Tanggal Mulai: <br />
                                                        <span className="font-bold">
                                                            {i.tanggal_mulai}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        Estimasi Selesai: <br />
                                                        <span className="font-bold">
                                                            {i.estimasi_selesai}
                                                        </span>
                                                    </p>
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
                                        </div>
                                        <div
                                            className="text-[10px] group-hover:block hidden absolute z-20 bottom-20 mb-5 right-5 cursor-pointer bg-pink-500/20 p-2 rounded-md"
                                            onClick={() =>
                                                handleBahanBaku(i.id)
                                            }
                                        >
                                            <p>Selsaikan produksi</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {updateProduksi && (
                                <div className="w-full h-screen pb-32 overflow-auto">
                                    <div
                                        className={`${
                                            createLaporan ? "hidden" : "block"
                                        }`}
                                    >
                                        <div className="cursor-pointer relative group shadow-lg rounded-xl p-5">
                                            <div className="flex justify-end mb-2">
                                                <div
                                                    className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                                    onClick={() =>
                                                        setUpdateProduksi(false)
                                                    }
                                                >
                                                    <img
                                                        src="/assets/icons/plus.png"
                                                        alt=""
                                                        className="w-3 h-3 rotate-45"
                                                    />
                                                </div>
                                            </div>
                                            <h1 className="font-black uppercase bg-green-500/20 text-center p-2 rounded-md">
                                                {dataProduksiDetail.id_produksi}
                                            </h1>

                                            <div>
                                                <h1 className="font-black border-b border-dashed py-2">
                                                    ID:{" "}
                                                    {
                                                        dataProduksiDetail.id_produk
                                                    }
                                                </h1>
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
                                                            Tanggal Mulai:{" "}
                                                            <br />
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
                                                            Estimasi Selesai:{" "}
                                                            <br />
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
                                                {groupedData.map(
                                                    (item, index) => (
                                                        <tr
                                                            className=""
                                                            key={
                                                                item.id_bahan_baku
                                                            }
                                                        >
                                                            <td className="px-3 py-2 border text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-3 py-2 border">
                                                                {
                                                                    item.id_bahan_baku
                                                                }
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
                                                            <td className="px-3 py-2 border">
                                                                {
                                                                    item.stok_sekarang
                                                                }
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
                                                        colSpan={8}
                                                        className="text-end px-3 py-2"
                                                    >
                                                        Total biaya produksi:
                                                    </td>
                                                    <td className="border px-3 py-2 text-end">
                                                        <FormaterRupiah
                                                            number={totalBiaya}
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
                                                            dataProduksiDetail.estimasi_selesai
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className="flex justify-end mt-5"
                                                onClick={() =>
                                                    handleLaporan(
                                                        dataProduksiDetail.id
                                                    )
                                                }
                                            >
                                                <PrimaryButton>
                                                    Buat laporan
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </div>

                                    {createLaporan && (
                                        <CreateLaporan
                                            id={produksiId}
                                            biayaProduksi={totalBiaya}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-screen overflow-auto">
                            {createLaporanVerifikasi && (
                                <div className="">
                                    <div className="absolute top-6 right-5 z-40">
                                        <div
                                            className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                            onClick={() =>
                                                setCreateLaporanVerifikasi(
                                                    false
                                                )
                                            }
                                        >
                                            <img
                                                src="/assets/icons/plus.png"
                                                alt=""
                                                className="w-3 h-3 rotate-45"
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <VerifikasiLaporan
                                            id={idLaporan}
                                            dataBahanBaku={filterBahanBaku}
                                            userId={auth.user.id}
                                        />
                                    </div>
                                </div>
                            )}
                            <div
                                className={`grid grid-cols-4 gap-5 pb-32 ${
                                    createLaporanVerifikasi ? "hidden" : "block"
                                }`}
                            >
                                {dataLaporanProduksi.map((i) => (
                                    <div
                                        key={i.id}
                                        className="cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <h1 className="font-bold p-2 rounded-md text-center bg-green-500/20">
                                            {i.id_laporan}
                                        </h1>
                                        <div>
                                            <h1 className="font-black border-b border-dashed py-2">
                                                ID: {i.id_produk}
                                            </h1>
                                            <div>
                                                <Label
                                                    className={"bg-red-500"}
                                                />
                                                <p className="capitalize">
                                                    {i.produk.nama_produk}
                                                    <span className="bg-pink-500/20 text-pink-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                                        {i.status_produksi}
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
                                                <p className="text-green-500 font-black mt-2">
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
                                            className="text-[10px] group-hover:block hidden absolute z-20 bottom-32 mb-3 right-5 cursor-pointer bg-pink-500/20 p-2 rounded-md"
                                            onClick={() =>
                                                handleVerifikasiLaporan(
                                                    i.id,
                                                    i.produksi_id
                                                )
                                            }
                                        >
                                            <p>Verifikasi laporan</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default LaporanProduksi;
