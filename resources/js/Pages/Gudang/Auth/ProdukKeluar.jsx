import RoleAccess from "@/Middleware/RoleAcces";
import React from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";

function ProdukKeluar({ auth }) {
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Produk Keluar"}
            ></NavbarGudang>
        </RoleAccess>
    );
}

export default ProdukKeluar;
