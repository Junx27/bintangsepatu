import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import Test from "@/Components/Test";

function Dashboard({ auth }) {
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar
                navbar={navbarProduksi}
                title={"Dashboard Produksi"}
            ></Navbar>
        </RoleAccess>
    );
}

export default Dashboard;
