import DownloadPDF from "@/Components/DownloadPDF";
import Notification from "@/Components/Notification";
import EditProfile from "@/Pages/Auth/EditProfile";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

function NavbarProduksi({
    children,
    navbar,
    title,
    auth,
    pdfRef,
    fileName,
    layout,
}) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const data = navbar;
    const [dataProduksi, setDataProduksi] = useState([]);
    const [dataPesanan, setDataPesanan] = useState([]);
    const [dataVerification, setDataVerification] = useState([]);
    const [dataUnVerification, setDataUnVerification] = useState([]);
    const [dataLaporanProduksi, setDataLaporanProduksi] = useState([]);
    const [dataLaporanProduksiSuccess, setDataLaporanProduksiSuccess] =
        useState([]);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [dataInventory, setDataInventory] = useState([]);

    useEffect(() => {
        const fetchDataProduksiSuccess = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/laporan-produksis-verified"
            );
            setDataLaporanProduksiSuccess(response.data);
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
        fetchDataProduksiSuccess();
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
    return (
        <div className="">
            <Head title={title} />
            {open && (
                <div className="absolute right-0 z-50 w-72 h-screen bg-white pt-20 px-5 border-l">
                    <EditProfile
                        userId={auth.user.id}
                        name={auth.user.name}
                        image={auth.user.image}
                    />
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
                    </div>
                    <div className="text-[8px] flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/icons/stock.png"
                                alt=""
                                className="w-5 h-5"
                            />
                            <p>
                                Jumlah Produk:{" "}
                                <span className="font-black text-[#0C15F7]">
                                    {dataInventory.length}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/icons/stock.png"
                                alt=""
                                className="w-5 h-5"
                            />
                            <p>
                                Jumlah Bahan Baku:{" "}
                                <span className="font-black text-[#0C15F7]">
                                    {dataBahanBaku.length}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/icons/checklist.png"
                                alt=""
                                className="w-5 h-5"
                            />
                            <p>
                                Terverifikasi:{" "}
                                <span className="font-black text-green-500">
                                    {dataLaporanProduksi.length}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/icons/enroll.png"
                                alt=""
                                className="w-5 h-5"
                            />
                            <p>
                                Belum Terverifikasi:{" "}
                                <span className="font-black text-red-500">
                                    {dataVerification.length +
                                        dataUnVerification.length}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/icons/preparation.png"
                                alt=""
                                className="w-5 h-5"
                            />
                            <p>
                                Persiapan Produksi:{" "}
                                <span className="font-black text-red-500">
                                    {dataProduksi.length}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5 text-[7px]">
                        <div className="hover:bg-blue-50 p-2 rounded-md cursor-pointer">
                            <img
                                src="/assets/icons/search.png"
                                alt=""
                                className="w-4 h-4"
                            />
                        </div>
                        <div className="hover:bg-blue-50 p-2 rounded-md cursor-pointer">
                            <img
                                src="/assets/icons/check.png"
                                alt=""
                                className="w-4 h-4"
                            />
                        </div>
                        <div className="hover:bg-blue-50 p-2 rounded-md cursor-pointer">
                            <DownloadPDF
                                pdfRef={pdfRef}
                                fileName={fileName}
                                layout={layout}
                            >
                                <img
                                    src="/assets/icons/printer.png"
                                    alt=""
                                    className="w-4 h-4"
                                />
                            </DownloadPDF>
                        </div>
                        <div
                            className={`relative hover:bg-blue-50 p-2 rounded-md cursor-pointer overflow-hidden ${
                                open ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setOpen(!open)}
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
                    </div>

                    <div className="flex gap-5 items-center text-xs">
                        <h1 className="text-sm font-bold w-32 truncate text-end capitalize">
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
                                parameter={"Dashboard"}
                                data={dataLaporanProduksiSuccess}
                            />
                            <Notification
                                nama={i.nama}
                                parameter={"Buat Produksi"}
                                data={dataProduksi}
                            />
                            <Notification
                                nama={i.nama}
                                parameter={"Lihat Pesanan"}
                                data={dataPesanan}
                            />
                            <Notification
                                nama={i.nama}
                                parameter={"Buat Laporan"}
                                data={dataVerification}
                            />
                            <Notification
                                nama={i.nama}
                                parameter={"Buat Laporan"}
                                data={dataUnVerification}
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

export default NavbarProduksi;
