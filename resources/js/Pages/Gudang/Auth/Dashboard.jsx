import RoleAccess from "@/Middleware/RoleAccess";
import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { navbarGudang } from "../Data/NavbarGudang";
import NavbarGudang from "../Layouts/NavbarGudang";
import ChartProduk from "../Layouts/ChartProduk";
import axios from "axios";
import ChartBahanBaku from "../Layouts/ChartBahanBaku";
import ChartProdukMasuk from "../Layouts/ChartProdukMasuk";
import ChartBahanBakuMasuk from "../Layouts/ChartBahanBakuMasuk";
import Label from "@/Components/Label";

function Dashboard({ auth }) {
    const navigasi = [
        {
            nama: "diagram produk masuk",
            icon: "/assets/icons/diagram.png",
        },
        {
            nama: "diagram stok produk",
            icon: "/assets/icons/diagram.png",
        },
        {
            nama: "diagram bahan baku masuk",
            icon: "/assets/icons/diagram.png",
        },
        {
            nama: "diagram stok bahan baku",
            icon: "/assets/icons/diagram.png",
        },
    ];
    const [view, setView] = useState("diagram produk masuk");
    const pdfRef = useRef();
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
            <NavbarGudang
                navbar={navbarGudang}
                auth={auth}
                title={"Dashboard Gudang"}
                pdfRef={pdfRef}
                fileName={"Dashboard.pdf"}
                layout={"l"}
                navigasi={
                    <div className="text-sm flex gap-2 items-center bg-white w-full">
                        <Label
                            className={"bg-[#0C15F7]"}
                            rotate={"rotate-90"}
                        />
                        {navigasi.map((item) => (
                            <div
                                key={item.nama}
                                className={`relative text-[8px] p-2 px-3 rounded-md cursor-pointer mr-5 text-center hover:bg-blue-50 overflow-hidden ${
                                    view === item.nama ? "bg-blue-50" : ""
                                }`}
                                onClick={() => setView(item.nama)}
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <img
                                        src={item.icon}
                                        alt=""
                                        className="w-4 h-4"
                                    />
                                    <p className="">
                                        {item.nama.charAt(0).toUpperCase() +
                                            item.nama.slice(1)}
                                    </p>
                                    <div
                                        className={`absolute top-8 w-full h-2 -ml-3 bg-[#0C15F7] transition-opacity duration-300 ${
                                            view === item.nama
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            >
                <div className="ml-20 mt-5 mr-5">
                    <div className="">
                        {view === "diagram produk masuk" ? (
                            <div className="w-full">
                                <ChartProdukMasuk analisis={dataProdukMasuk} />
                            </div>
                        ) : view === "diagram stok produk" ? (
                            <div className="w-full">
                                <ChartProduk analisis={dataProduk} />
                            </div>
                        ) : view === "diagram bahan baku masuk" ? (
                            <div className="w-full">
                                <ChartBahanBakuMasuk
                                    analisis={dataBahanBakuMasuk}
                                />
                            </div>
                        ) : (
                            <div className="w-full">
                                <ChartBahanBaku analisis={dataBahanBaku} />
                            </div>
                        )}
                    </div>
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default Dashboard;
