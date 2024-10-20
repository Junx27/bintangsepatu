import RoleAccess from "@/Middleware/RoleAcces";
import React, { useRef, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import LaporanProdukMasuk from "../Layouts/LaporanProdukMasuk";
import LaporanBahanBaku from "../Layouts/LaporanBahanBaku";
import Label from "@/Components/Label";

function LaporanGudang({ auth }) {
    const pdfRef = useRef();
    const [view, setView] = useState("produk");
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
                            <h1 className="font-bold">Daftar laporan gudang</h1>
                        </div>
                        <div className="mb-5 flex uppercase gap-5 text-[10px]">
                            <p
                                className={`cursor-pointer w-20 text-center p-1 rounded-md border border-dashed border-green-500 hover:text-green-500 ${
                                    view === "produk"
                                        ? "text-green-500 bg-green-500/20 font-bold"
                                        : ""
                                }`}
                                onClick={() => setView("produk")}
                            >
                                Produk
                            </p>
                            <p
                                className={`cursor-pointer w-20 text-center p-1 rounded-md border border-dashed border-green-500 hover:text-green-500 ${
                                    view === "bahan baku"
                                        ? "text-green-500 bg-green-500/20 font-bold"
                                        : ""
                                }`}
                                onClick={() => setView("bahan baku")}
                            >
                                Bahan Baku
                            </p>
                        </div>
                    </div>
                    {view === "produk" ? (
                        <div ref={pdfRef} className="pb-64 px-5">
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
