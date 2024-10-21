import RoleAccess from "@/Middleware/RoleAcces";
import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { navbarGudang } from "../Data/NavbarGudang";
import NavbarGudang from "../Layouts/NavbarGudang";
import ChartProduk from "../Layouts/ChartProduk";
import axios from "axios";
import ChartBahanBaku from "../Layouts/ChartBahanBaku";
import ChartProdukMasuk from "../Layouts/ChartProdukMasuk";
import ChartBahanBakuMasuk from "../Layouts/ChartBahanBakuMasuk";

function Dashboard({ auth }) {
    const [dataProduk, setDataProduk] = useState([]);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [dataProdukMasuk, setDataProdukMasuk] = useState([]);
    const [dataBahanBakuMasuk, setDataBahanBakuMasuk] = useState([]);
    useEffect(() => {
        const fetDataProduk = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataProduk(response.data);
        };
        const fetchDataBahanBaku = async () => {
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataBahanBaku(response.data);
        };
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProdukMasuk(response.data);
        };
        const fetchDataBahanBakuMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-bahan-baku-masuk-gudang"
            );
            setDataBahanBakuMasuk(response.data);
        };
        fetchDataBahanBakuMasuk();
        fetchDataProdukMasuk();
        fetchDataBahanBaku();
        fetDataProduk();
    }, []);
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang navbar={navbarGudang} title={"Dashboard Gudang"}>
                <div className="fixed right-0 h-screen overflow-auto w-64 bg-red-500"></div>
                <div className="flex gap-10 m-10 ml-20 mr-64 pr-5">
                    <div className="w-full">
                        <ChartProdukMasuk analisis={dataProdukMasuk} />
                    </div>
                    <div className="w-full">
                        <ChartBahanBakuMasuk analisis={dataBahanBakuMasuk} />
                    </div>
                </div>
                <div className="flex gap-10 m-10 ml-20 mr-64 pr-5">
                    <div className="w-full">
                        <ChartProduk analisis={dataProduk} />
                    </div>
                    <div className="w-full">
                        <ChartBahanBaku analisis={dataBahanBaku} />
                    </div>
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default Dashboard;
