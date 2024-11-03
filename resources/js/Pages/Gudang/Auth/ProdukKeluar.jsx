import RoleAccess from "@/Middleware/RoleAccess";
import React, { useEffect, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import axios from "axios";
import { useForm } from "@inertiajs/react";
import Notification from "@/Components/Notification";
import Label from "@/Components/Label";
import DataRepairProduk from "../Layouts/DataRepairProduk";
import LaporanRepairProduk from "../Layouts/LaporanRepairProduk";
import LaporanBahanBakuKeluar from "../Layouts/LaporanBahanBakuKeluar";

function ProdukKeluar({ auth }) {
    const navigasi = [
        {
            nama: "verifikasi pesanan masuk",
            icon: "/assets/icons/enroll.png",
        },
        {
            nama: "verifikasi produk repair",
            icon: "/assets/icons/bad-stock.png",
        },
        {
            nama: "laporan repair produk",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "laporan bahan baku keluar",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "laporan produk keluar",
            icon: "/assets/icons/product.png",
        },
    ];
    const [view, setView] = useState("verifikasi pesanan masuk");
    const [idProdukMasuk, setIdProdukMasuk] = useState(null);
    const [jumlahProdukMasuk, setJumlahIdProdukMasuk] = useState(0);
    const [dataProdukMasuk, setDataProdukMasuk] = useState([]);
    const [konfirmasiProduk, setKonfirmasiProduk] = useState(false);
    const [dataRepair, setDataRepair] = useState([]);
    const { data, setData, put } = useForm({
        tanggal_penerimaan_produk: "",
        jumlah_produk_diterima: jumlahProdukMasuk,
    });
    useEffect(() => {
        const fetchDataRepair = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataRepair(response.data);
        };
        fetchDataRepair();
    }, []);

    const filterDataRepair = dataRepair.filter(
        (item) =>
            item.jumlah_produk_ditolak !== 0 &&
            item.status_penerimaan_produk !== "diverifikasi repair"
    );

    useEffect(() => {
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProdukMasuk(response.data);
        };
        if (jumlahProdukMasuk > 0) {
            setData("jumlah_produk_diterima", jumlahProdukMasuk);
        }
        fetchDataProdukMasuk();
    }, [jumlahProdukMasuk]);
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Produk Keluar"}
                auth={auth}
                navigasi={
                    <div className="text-sm flex gap-2 items-center bg-white w-full">
                        <Label
                            className={"bg-[#0C15F7]"}
                            rotate={"rotate-90"}
                        />
                        {navigasi.map((item) => (
                            <div
                                key={item.nama}
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

                                    <Notification
                                        nama={item.nama}
                                        parameter={"verifikasi produk repair"}
                                        data={filterDataRepair}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                }
            >
                <div className="ml-20 mt-5 mr-5 h-screen overflow-auto">
                    {view === "verifikasi pesanan masuk" ? (
                        <div>verifikasi pesanan masuk</div>
                    ) : view === "verifikasi produk repair" ? (
                        <div>
                            <DataRepairProduk />
                        </div>
                    ) : view === "laporan repair produk" ? (
                        <div>
                            <LaporanRepairProduk />
                        </div>
                    ) : view === "laporan bahan baku keluar" ? (
                        <div>
                            <LaporanBahanBakuKeluar />
                        </div>
                    ) : (
                        <div>laporan produk keluar</div>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default ProdukKeluar;
