import DownloadPDF from "@/Components/DownloadPDF";
import Notification from "@/Components/Notification";
import PopOver from "@/Components/PopOver";
import EditProfile from "@/Pages/Auth/EditProfile";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

function NavbarGudang({ children, navbar, title, auth, navigasi }) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const data = navbar;
    const [dataProduksi, setDataProduksi] = useState([]);
    const [dataPesanan, setDataPesanan] = useState([]);
    const [dataVerification, setDataVerification] = useState([]);
    const [dataUnVerification, setDataUnVerification] = useState([]);
    const [dataLaporanProduksi, setDataLaporanProduksi] = useState([]);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [dataInventory, setDataInventory] = useState([]);
    const [dataProdukMasuk, setDataProdukMasuk] = useState([]);

    useEffect(() => {
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProdukMasuk(response.data);
        };
        const fetchDataProduk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/produksi-proses"
            );
            setDataProduksi(response.data);
        };
        const fetchDataVerify = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/produksi-verification"
            );
            setDataVerification(response.data);
        };
        const fetchDataUnVerify = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis"
            );
            setDataUnVerification(response.data);
        };
        const fetchDataPesanan = async () => {
            const response = await axios.get("/api/bintangsepatu/pesanans");
            setDataPesanan(response.data);
        };
        const fetchDataProduksi = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis-verified"
            );
            setDataLaporanProduksi(response.data);
        };
        const fetchDataBahanBaku = async () => {
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataBahanBaku(response.data);
        };
        const fetchDataInventory = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataInventory(response.data);
        };
        fetchDataProdukMasuk();
        fetchDataUnVerify();
        fetchDataInventory();
        fetchDataBahanBaku();
        fetchDataProduksi();
        fetchDataVerify();
        fetchDataPesanan();
        fetchDataProduk();
    }, []);
    const repair = [
        {
            qty: 1,
        },
    ];
    const filterProdukMasuk = dataProdukMasuk.filter(
        (item) => item.status_penerimaan_produk === "pending"
    );
    const filterProdukMasukVerifikasi = dataProdukMasuk.filter(
        (item) => item.status_penerimaan_produk === "diterima"
    );
    return (
        <div className="">
            <Head title={title} />
            {open && (
                <div className="absolute z-30 w-72 h-scree">
                    <PopOver>
                        <EditProfile
                            userId={auth.user.id}
                            name={auth.user.name}
                            image={auth.user.image}
                            handleClose={() => setOpen(!open)}
                        />
                    </PopOver>
                </div>
            )}
            <div className="fixed top-0 bg-white border-b w-full py-2 left-0 px-4 z-50">
                <div className="flex gap-10 justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                        <img
                            src="/assets/logo.png"
                            alt=""
                            className="w-6 h-6"
                        />
                        <h2 className="font-black text-[#0C15F7]">
                            BINTANG SEPATU
                        </h2>
                        <div>{navigasi}</div>
                    </div>
                    <div className="flex gap-5 items-center text-xs">
                        <div
                            className={`relative hover:bg-blue-50 p-2 rounded-md cursor-pointer overflow-hidden ${
                                open ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setOpen(true)}
                        >
                            <img
                                src="/assets/icons/settings.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <div
                                className={`absolute bottom-0 left-0 h-[5px] w-full bg-[#0C15F7] transition-opacity rounded-l-md duration-300 ${
                                    open ? "opacity-100" : "opacity-0"
                                }`}
                            ></div>
                        </div>
                        <h1 className="text-sm font-bold truncate text-end capitalize">
                            {auth.user.name}
                        </h1>
                        <img
                            src={`storage/${auth.user.image}`}
                            alt=""
                            className="w-8 h-8 rounded-full"
                        />
                    </div>
                </div>
            </div>
            <div className="w-[60px] transition-all duration-700 fixed z-40 bg-white border-r h-screen pt-20">
                <div className="mx-2 flex flex-col gap-5 text-sm">
                    {data.map((i) => (
                        <Link
                            key={i.nama}
                            href={i.link}
                            className={`relative p-1 group flex gap-5 items-center rounded-md hover:bg-blue-50 ${
                                url === i.link ? "bg-blue-50" : ""
                            } 
                            `}
                        >
                            <img
                                src={i.gambar}
                                alt=""
                                className="w-5 h-5 mx-auto"
                            />
                            <p className="transtion-all duration-200 group-hover:block absolute truncate w-0 group-hover:w-20 text-[10px] ml-9 bg-blue-50 group-hover:p-1 rounded-r-md overflow-hidden">
                                {i.nama}
                            </p>
                            <div
                                className={`absolute top-0 left-0 w-[5px] h-full bg-[#0C15F7] transition-opacity rounded-l-md duration-300 ${
                                    url === i.link ? "opacity-100" : "opacity-0"
                                }`}
                            ></div>
                            {i.nama === "Daftar Repair" && (
                                <span
                                    className={`w-2 h-2 bg-red-500 rounded-full absolute right-1 top-1 animate-pulse ${
                                        repair.length ? "block" : "hidden"
                                    }`}
                                ></span>
                            )}
                            <Notification
                                nama={i.nama}
                                parameter={"Produk Masuk"}
                                data={filterProdukMasuk}
                            />
                            <Notification
                                nama={i.nama}
                                parameter={"Produk Masuk"}
                                data={filterProdukMasukVerifikasi}
                            />
                        </Link>
                    ))}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="relative group hover:bg-yellow-300 p-1 rounded-md"
                    >
                        <img
                            src="/assets/icons/logout.png"
                            alt=""
                            className="w-5 h-5 mx-auto"
                        />
                        <p className="transtion-all top-0 duration-200 group-hover:block absolute truncate w-0 group-hover:w-20 text-[10px] ml-9 bg-yellow-300 group-hover:p-1 rounded-r-md overflow-hidden">
                            Logout
                        </p>
                    </Link>
                </div>
            </div>
            <div className="mt-12 fixed w-screen">{children}</div>
        </div>
    );
}

export default NavbarGudang;
