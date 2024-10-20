import RoleAccess from "@/Middleware/RoleAcces";
import React from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";

function PesanMasuk({ auth }) {
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Pesan Masuk"}
            ></NavbarGudang>
        </RoleAccess>
    );
}

export default PesanMasuk;
