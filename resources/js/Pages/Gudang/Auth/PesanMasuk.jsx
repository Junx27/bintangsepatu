import RoleAccess from "@/Middleware/RoleAccess";
import React from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";

function PesanMasuk({ auth }) {
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                auth={auth}
                navbar={navbarGudang}
                title={"Pesan Masuk"}
            ></NavbarGudang>
        </RoleAccess>
    );
}

export default PesanMasuk;
