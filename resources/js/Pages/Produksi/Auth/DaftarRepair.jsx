import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";

function DaftarRepair({ auth }) {
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar navbar={navbarProduksi} title={"Daftar Repair"}></Navbar>
        </RoleAccess>
    );
}

export default DaftarRepair;
