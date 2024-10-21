import RoleAccess from "@/Middleware/RoleAcces";
import React from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";

function ProdukKeluar({ auth }) {
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang navbar={navbarGudang} title={"Produk Keluar"}>
                <h1 className="font-bold text-center mt-32">
                    Fitur dalam pengembangan, tersedia jika fitur pemasaran
                    sudah ada
                </h1>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default ProdukKeluar;
