import RoleAccess from "@/Middleware/RoleAcces";
import { Link } from "@inertiajs/react";
import React from "react";
import { navbarGudang } from "../Data/NavbarGudang";
import NavbarGudang from "../Layouts/NavbarGudang";

function Dashboard({ auth }) {
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Dashboard Gudang"}
            ></NavbarGudang>
        </RoleAccess>
    );
}

export default Dashboard;
