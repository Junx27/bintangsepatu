import Notification from "@/Components/Notification";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

function NavbarProduksi({ children, navbar, title }) {
    const { url } = usePage();
    const [open, setOpen] = useState(true);
    const data = navbar;
    const [dataProduksi, setDataProduksi] = useState([]);
    const [dataPesanan, setDataPesanan] = useState([]);
    const [dataVerification, setDataVerification] = useState([]);
    const [dataUnVerification, setDataUnVerification] = useState([]);
    const [dataLaporanProduksi, setDataLaporanProduksi] = useState([]);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [dataInventory, setDataInventory] = useState([]);

    useEffect(() => {
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
                    <div className="flex gap-5 text-[8px]">
                        <div className="flex flex-col items-center gap-2 bg-blue-500/20 p-2 rounded-md font-black w-20 border border-dashed border-blue-500">
                            <h1>Produk:</h1>
                            <p className="text-blue-500">
                                {dataInventory.length}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-purple-500/20 p-2 rounded-md font-black w-20 border border-dashed border-purple-500">
                            <h1>Bahan Baku:</h1>
                            <p className="text-purple-500">
                                {dataBahanBaku.length}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-green-500/20 p-2 rounded-md font-black w-20 border border-dashed border-green-500">
                            <h1>Verify:</h1>
                            <p className="text-green-500">
                                {dataLaporanProduksi.length}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-yellow-500/20 p-2 rounded-md font-black w-20 border border-dashed border-yellow-500">
                            <h1>Unverify:</h1>
                            <p className="text-red-500">
                                {dataVerification.length +
                                    dataUnVerification.length}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-pink-500/20 p-2 rounded-md font-black w-20 border border-dashed border-red-500">
                            <h1>Prepairing:</h1>
                            <p className="text-red-500">
                                {dataProduksi.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5 text-[7px]">
                        <div className="flex flex-col items-center gap-1 hover:bg-yellow-300 p-2 rounded-md w-12">
                            <img
                                src="/assets/icons/search.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <h1>Cari</h1>
                        </div>
                        <div className="flex flex-col items-center gap-1 hover:bg-yellow-300 p-2 rounded-md w-12">
                            <img
                                src="/assets/icons/check.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <h1>Status</h1>
                        </div>
                        <div className="flex flex-col items-center gap-1 hover:bg-yellow-300 p-2 rounded-md w-12">
                            <img
                                src="/assets/icons/printer.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <h1>Cetak</h1>
                        </div>
                        <div className="flex flex-col items-center gap-1 hover:bg-yellow-300 p-2 rounded-md w-12">
                            <img
                                src="/assets/icons/settings.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <h1>Pengaturan</h1>
                        </div>
                        <div className="relative flex flex-col items-center gap-1 hover:bg-yellow-300 p-2 rounded-md w-12">
                            <img
                                src="/assets/icons/alert.png"
                                alt=""
                                className="w-4 h-4"
                            />
                            <h1>Notifikasi</h1>
                            <span className="w-2 h-2 bg-red-500 rounded-full absolute right-2 animate-pulse"></span>
                        </div>
                    </div>

                    <div className="flex gap-5 items-center text-xs">
                        <h1 className="text-sm font-bold">Ardiansyah</h1>
                        <img
                            src="https://web.rupa.ai/wp-content/uploads/2023/06/GVS_A_simple_background_for_a_LinkedIn_profile_picture_perhaps__75435bbf-9b8f-4815-8e9e-d5194e92061d.png"
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
                            className={`relative p-1 group flex gap-5 items-center rounded-md hover:bg-yellow-300 ${
                                url === i.link ? "bg-yellow-300" : ""
                            } 
                            `}
                        >
                            <img
                                src={i.gambar}
                                alt=""
                                className="w-5 h-5 mx-auto"
                            />
                            <p className="transtion-all duration-200 group-hover:block absolute truncate w-0 group-hover:w-20 text-[10px] ml-9 bg-yellow-300 group-hover:p-1 rounded-r-md overflow-hidden">
                                {i.nama}
                            </p>
                            {i.nama === "Daftar Repair" && (
                                <span
                                    className={`w-2 h-2 bg-red-500 rounded-full absolute right-1 top-1 animate-pulse ${
                                        repair.length ? "block" : "hidden"
                                    }`}
                                ></span>
                            )}
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
