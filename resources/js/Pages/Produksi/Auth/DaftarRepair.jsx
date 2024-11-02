import RoleAccess from "@/Middleware/RoleAccess";
import React from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import NavbarProduksi from "../Layouts/NavbarProduksi";

function DaftarRepair({ auth }) {
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <NavbarProduksi
                navbar={navbarProduksi}
                title={"Daftar Repair"}
                auth={auth}
            ></NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarRepair;
