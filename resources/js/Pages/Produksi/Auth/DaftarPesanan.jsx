import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import NavbarProduksi from "../Layouts/NavbarProduksi";

function DaftarPesanan({ auth }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/pesanans");
            setData(response.data);
        };
        fetchData();
    }, []);
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <NavbarProduksi
                navbar={navbarProduksi}
                title={"Daftar Pesanan"}
                auth={auth}
            >
                <h1 className="font-bold text-center mt-32">
                    Fitur dalam pengembangan, tersedia jika fitur pemasaran
                    sudah ada
                </h1>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarPesanan;
