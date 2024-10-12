import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import _ from "lodash";

function LaporanProduksi({ auth }) {
    const [dataProduksi, setDataProduksi] = useState([]);
    const [dataProduksiBahanBaku, setDataProduksiBahanBaku] = useState([]);
    const [dataProduksiDetail, setDataProduksiDetail] = useState([]);
    const [id, setId] = useState(null);
    const [updateProduksi, setUpdateProduksi] = useState(false);

    useEffect(() => {
        const fetchDataPrduksi = async () => {
            const response = await axios.get("/api/bintangsepatu/produksis");
            setDataProduksi(response.data);
        };
        const fetchDataPrduksiBahanBaku = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produksis"
            );
            setDataProduksiBahanBaku(response.data);
        };
        const fetchDataPrduksiDetail = async () => {
            const response = await axios.get(
                `/api/bintangsepatu/produksi/${id}`
            );
            setDataProduksiDetail(response.data);
        };
        fetchDataPrduksiBahanBaku();
        fetchDataPrduksiDetail();
        fetchDataPrduksi();
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
            return {
                id_bahan_baku,
                nama_bahan_baku: firstItem.bahan.nama_bahan_baku,
                stok_bahan_baku: firstItem.stok_awal,
                jumlah_bahan_baku: _.sumBy(items, "jumlah_bahan_baku"),
                sisa: firstItem.stok_awal - _.sumBy(items, "jumlah_bahan_baku"),
                stok_sekarang: firstItem.bahan.stok_bahan_baku,
            };
        })
        .value();

    const handleSubmit = () => {};
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar navbar={navbarProduksi} title={"Laporan Produksi"}>
                <div className="m-12">
                    <div className="flex">
                        <div
                            className={`transition-all duration-300 flex flex-col h-screen overflow-auto pb-32 border-r p-5 ml-2 ${
                                updateProduksi ? "w-64 gap-2" : "w-96 gap-5"
                            }`}
                        >
                            {dataProduksi.map((i) => (
                                <div
                                    key={i.id}
                                    className="hover:bg-blue-50 cursor-pointer relative group shadow-lg rounded-xl p-5"
                                >
                                    <h1 className="font-black uppercase bg-pink-500/20 text-center p-2 border border-dashed border-pink-500 rounded-md">
                                        {i.id_produksi}
                                    </h1>
                                    {!updateProduksi && (
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
                                    )}
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
                            <div className="w-full h-screen">
                                <div className="flex justify-end">
                                    <div
                                        className="bg-yellow-300 p-2 rounded-md text-center  cursor-pointer w-7"
                                        onClick={() => setUpdateProduksi(false)}
                                    >
                                        <img
                                            src="/assets/icons/plus.png"
                                            alt=""
                                            className="w-3 h-3 rotate-45"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    {dataProduksiDetail.id_produksi} <br />
                                    {dataProduksiDetail.id}
                                    {groupedData.map((item) => (
                                        <div
                                            className=""
                                            key={item.id_bahan_baku}
                                        >
                                            <div className="flex gap-10">
                                                <p>{item.id_bahan_baku}</p>
                                                <p>{item.nama_bahan_baku}</p>
                                                <p>{item.stok_bahan_baku}</p>
                                                <p>{item.jumlah_bahan_baku}</p>
                                                <p>{item.sisa}</p>
                                                <p>{item.stok_sekarang}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Navbar>
        </RoleAccess>
    );
}

export default LaporanProduksi;
