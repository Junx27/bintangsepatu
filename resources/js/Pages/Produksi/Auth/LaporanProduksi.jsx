import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import _ from "lodash";
import Table from "@/Layouts/Tabel";
import FormateDate from "@/Components/FormateDate";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateLaporan from "@/Layouts/CreateLaporan";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import PopOver from "@/Components/PopOver";
import VerifikasiLaporan from "@/Layouts/VerifikasiLaporan";

function LaporanProduksi({ auth }) {
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
    const filterBahanBaku = _.filter(
        dataProduksiBahanBaku,
        (item) => item.produksi_id === produksiId
    );
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar navbar={navbarProduksi} title={"Laporan Produksi"}>
                <div className="mx-12 mt-5">
                    {createLaporanVerifikasi && (
                        <div className="ml-7 mt-5 mr-56">
                            <div className="flex justify-end mb-2">
                                <div
                                    className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                    onClick={() =>
                                        setCreateLaporanVerifikasi(false)
                                    }
                                >
                                    <img
                                        src="/assets/icons/plus.png"
                                        alt=""
                                        className="w-3 h-3 rotate-45"
                                    />
                                </div>
                            </div>
                            <div className="-mt-10">
                                <VerifikasiLaporan
                                    id={idLaporan}
                                    dataBahanBaku={filterBahanBaku}
                                    userId={auth.user.id}
                                />
                            </div>
                        </div>
                    )}
                    <div
                        className={`ml-7 mt-10 mr-56 ${
                            createLaporanVerifikasi ? "hidden" : "block"
                        }`}
                    >
                        <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                            <Label
                                className={"bg-purple-500"}
                                rotate={"rotate-90"}
                            />
                            <h1 className="font-bold">
                                Daftar produksi yang sedang diproses
                            </h1>
                        </div>
                        <div
                            className={`grid grid-cols-3 gap-5 ${
                                updateProduksi ? "hidden" : "block"
                            }`}
                        >
                            {dataProduksi.map((i) => (
                                <div
                                    key={i.id}
                                    className="hover:border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5"
                                >
                                    <h1 className="font-black uppercase bg-pink-500/20 text-center p-2 border border-dashed border-pink-500 rounded-md">
                                        {i.id_produksi}
                                    </h1>
                                    <div>
                                        <h1 className="font-black border-b border-dashed py-2">
                                            ID: {i.id_produk}
                                        </h1>
                                        <div>
                                            <Label className={"bg-red-500"} />
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
                                        className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                        onClick={() => handleBahanBaku(i.id)}
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
                        {updateProduksi && (
                            <div className="w-full h-screen pb-32 overflow-auto">
                                <div
                                    className={`${
                                        createLaporan ? "hidden" : "block"
                                    }`}
                                >
                                    <div className="hover:border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5">
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
                                        <h1 className="font-black uppercase bg-green-500/20 text-center p-2 border border-dashed border-green-500 rounded-md">
                                            {dataProduksiDetail.id_produksi}
                                        </h1>

                                        <div>
                                            <h1 className="font-black border-b border-dashed py-2">
                                                ID:{" "}
                                                {dataProduksiDetail.id_produk}
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
                                                        {item.harga_bahan_baku}
                                                    </td>
                                                    <td className="px-3 py-2 border text-end">
                                                        {item.sub_total}
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
                                                <td className="border px-3 py-2 text-end">
                                                    {totalBiaya}
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
                    <div className="fixed right-0 z-30 top-12 h-screen overflow-auto">
                        <div className="w-64 h-screen bg-white p-5 pt-10 border-l">
                            <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                                <Label
                                    className={"bg-red-500"}
                                    rotate={"rotate-90"}
                                />
                                <h1 className="font-bold">
                                    Verifikasi laporan produksi
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
                                            className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                            onClick={() =>
                                                handleVerifikasiLaporan(
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

export default LaporanProduksi;
