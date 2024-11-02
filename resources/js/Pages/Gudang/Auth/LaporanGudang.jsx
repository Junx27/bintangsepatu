import RoleAccess from "@/Middleware/RoleAccess";
import React, { useRef, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import LaporanProdukMasuk from "../Layouts/LaporanProdukMasuk";
import Label from "@/Components/Label";
import LaporanBahanBakuMasuk from "../Layouts/LaporanBahanBakuMasuk";
import LaporanStokProduk from "../Layouts/LaporanStokProduk";
import LaporanStokBahanBaku from "../Layouts/LaporanStokBahanBaku";
import LaporanSisaBahanBaku from "../Layouts/LaporanSisaBahanBaku";

function LaporanGudang({ auth }) {
    const navigasi = [
        {
            nama: "laporan produk masuk",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "laporan stok produk",
            icon: "/assets/icons/stock.png",
        },
        {
            nama: "laporan bahan baku masuk",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "laporan sisa bahan baku produksi",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "laporan stok bahan baku",
            icon: "/assets/icons/stock.png",
        },
    ];
    const pdfRef = useRef();
    const [view, setView] = useState("laporan produk masuk");
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                auth={auth}
                navbar={navbarGudang}
                title={"Laporan Gudang"}
                pdfRef={pdfRef}
                fileName={"text.pdf"}
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
                                </div>
                            </div>
                        ))}
                    </div>
                }
            >
                <div className="ml-20 mt-5 mr-5 h-screen overflow-auto">
                    {view === "laporan produk masuk" ? (
                        <div ref={pdfRef} className="">
                            <LaporanProdukMasuk />
                        </div>
                    ) : view === "laporan stok produk" ? (
                        <div ref={pdfRef}>
                            <LaporanStokProduk />
                        </div>
                    ) : view === "laporan bahan baku masuk" ? (
                        <div ref={pdfRef} className="">
                            <LaporanBahanBakuMasuk />
                        </div>
                    ) : view === "laporan sisa bahan baku produksi" ? (
                        <div ref={pdfRef}>
                            <LaporanSisaBahanBaku />
                        </div>
                    ) : (
                        <div ref={pdfRef}>
                            <LaporanStokBahanBaku />
                        </div>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default LaporanGudang;
