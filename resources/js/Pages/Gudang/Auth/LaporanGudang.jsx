import RoleAccess from "@/Middleware/RoleAcces";
import React, { useRef, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import LaporanProdukMasuk from "../Layouts/LaporanProdukMasuk";
import LaporanBahanBaku from "../Layouts/LaporanBahanBaku";
import Label from "@/Components/Label";

function LaporanGudang({ auth }) {
    const pdfRef = useRef();
    const [view, setView] = useState("laporan produk masuk");
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Laporan Gudang"}
                pdfRef={pdfRef}
                fileName={"text.pdf"}
            >
                <div className="ml-20 mt-10 mr-5 h-screen overflow-auto">
                    <div className="bg-white relative z-30">
                        <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                            <Label
                                className={"bg-green-500"}
                                rotate={"rotate-90"}
                            />
                            {[
                                "laporan produk masuk",
                                "laporan produk keluar",
                                "laporan bahan baku masuk",
                                "laporan bahan baku keluar",
                            ].map((item) => (
                                <p
                                    key={item}
                                    className={`cursor-pointer mr-5 text-center hover:text-[#0C15F7] ${
                                        view === item ? "text-[#0C15F7]" : ""
                                    }`}
                                    onClick={() => setView(item)}
                                >
                                    {item.charAt(0).toUpperCase() +
                                        item.slice(1)}
                                </p>
                            ))}
                        </div>
                    </div>
                    {view === "laporan produk masuk" ? (
                        <div ref={pdfRef} className="">
                            <LaporanProdukMasuk />
                        </div>
                    ) : view === "laporan produk keluar" ? (
                        <div ref={pdfRef}>
                            <LaporanBahanBaku />
                        </div>
                    ) : view === "laporan bahan baku masuk" ? (
                        <div ref={pdfRef} className="">
                            <LaporanProdukMasuk />
                        </div>
                    ) : (
                        <div ref={pdfRef}>
                            <LaporanBahanBaku />
                        </div>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default LaporanGudang;
