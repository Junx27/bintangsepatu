import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PopOver from "@/Components/PopOver";
import BahanBaku from "../Layouts/BahanBaku";
import NavbarProduksi from "../Layouts/NavbarProduksi";
import Notification from "@/Components/Notification";

function DaftarProduksi({ auth }) {
    const navigasi = [
        {
            nama: "tambah produksi baru",
            icon: "/assets/icons/add-product.png",
        },
        {
            nama: "tambah bahan baku produksi",
            icon: "/assets/icons/list.png",
        },
    ];
    const [view, setView] = useState("tambah produksi baru");
    const [id, setId] = useState(null);
    const [createProduksi, setCreateProduksi] = useState(false);
    const [tambahBahanBaku, setTambahBahanBaku] = useState(false);
    const [dataProduk, setDataProduk] = useState([]);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [dataProduksi, setDataProduksi] = useState([]);
    const {
        data,
        setData,
        post,
        delete: destroy,
        errors,
    } = useForm({
        id_produksi: "",
        id_produk: "",
        nama_produk: "",
        jumlah_produksi: "",
        tanggal_mulai: "",
        estimasi_selesai: "",
        status_produksi: "persiapan",
        produk_id: "",
        user_id: "",
    });

    useEffect(() => {
        const fetchDataProduk = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataProduk(response.data);
        };
        if (id !== null) {
            const fetchSingleData = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/produk/${id}`
                );
                setData({
                    id_produk: response.data.id_produk,
                    nama_produk: response.data.nama_produk,
                    produk_id: response.data.id,
                    status_produksi: "persiapan",
                    user_id: auth.user.id,
                });
            };
            fetchSingleData();
        }
        const fetchDataBahanBaku = async () => {
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataBahanBaku(response.data);
        };

        const fetchDataProduksi = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/produksi-proses"
            );
            setDataProduksi(response.data);
        };
        fetchDataProduksi();
        fetchDataBahanBaku();
        fetchDataProduk();
    }, [id]);
    const handleCreateProduksi = (id) => {
        setId(id);
        setCreateProduksi(true);
    };
    const handleBahanBaku = (id) => {
        setId(id);
        setTambahBahanBaku(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-produksi-produksi");
    };

    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <NavbarProduksi
                navbar={navbarProduksi}
                title={"Daftar Produksi"}
                auth={auth}
            >
                {errors.message && (
                    <PopOver>
                        <div className="flex flex-col items-center bg-white p-5 rounded w-96">
                            <p className="text-center mb-5">{errors.message}</p>
                            <PrimaryButton
                                onClick={() => window.location.reload()}
                            >
                                Coba lagi
                            </PrimaryButton>
                        </div>
                    </PopOver>
                )}
                <div className="relative m-5 ml-20">
                    <div className="sticky top-0 z-30 text-sm mb-5 flex gap-2 items-center bg-white w-full py-2">
                        <Label
                            className={"bg-[#0C15F7]"}
                            rotate={"rotate-90"}
                        />
                        {navigasi.map((item) => (
                            <div
                                key={item}
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
                                <Notification
                                    nama={item.nama}
                                    parameter={"tambah bahan baku produksi"}
                                    data={dataProduksi}
                                />
                            </div>
                        ))}
                    </div>
                    {view === "tambah produksi baru" ? (
                        <div className="h-screen overflow-auto pb-32">
                            <div
                                className={`grid grid-cols-4 gap-5 pb-32 ${
                                    createProduksi ? "hidden" : "block"
                                }`}
                            >
                                {dataProduk.map((i) => (
                                    <div
                                        key={i.id}
                                        className="cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <div className="w-full h-32">
                                            <img
                                                src={`storage/${i.gambar_produk}`}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <h1 className="font-black border-b border-dashed pb-2 mt-2">
                                            ID: {i.id_produk}
                                        </h1>
                                        <div>
                                            <Label
                                                rotate={`${
                                                    i.stok_produk >
                                                    i.stok_minimum_produk
                                                        ? ""
                                                        : i.stok_produk ===
                                                          i.stok_minimum_produk
                                                        ? ""
                                                        : "rotate-180"
                                                }`}
                                                className={`${
                                                    i.stok_produk >
                                                    i.stok_minimum_produk
                                                        ? "bg-green-600"
                                                        : i.stok_produk ===
                                                          i.stok_minimum_produk
                                                        ? "bg-purple-500"
                                                        : "bg-red-600"
                                                }`}
                                            />
                                            <p className="capitalize">
                                                {i.nama_produk}
                                                <span
                                                    className={`relative ml-3 rounded-full text-center p-1 text-[10px] font-normal pl-5 pr-3 ${
                                                        i.stok_produk >
                                                        i.stok_minimum_produk
                                                            ? "bg-green-500/20 text-green-600"
                                                            : i.stok_produk ===
                                                              i.stok_minimum_produk
                                                            ? "bg-purple-500/20 text-purple-500"
                                                            : "bg-red-500/20 text-red-600"
                                                    }`}
                                                >
                                                    {i.stok_produk >
                                                    i.stok_minimum_produk
                                                        ? "+aman"
                                                        : i.stok_produk ===
                                                          i.stok_minimum_produk
                                                        ? "+cukup"
                                                        : "-kurang"}
                                                    <span
                                                        className={`inset-0 absolute w-2 h-2 top-[6px] left-1 rounded-full animate-pulse ${
                                                            i.stok_produk >
                                                            i.stok_minimum_produk
                                                                ? "bg-green-500"
                                                                : i.stok_produk ===
                                                                  i.stok_minimum_produk
                                                                ? "bg-purple-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    ></span>
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="mt-3 text-xs">
                                                <p>
                                                    Stok Sekarang: <br />
                                                    <span className="font-bold">
                                                        {i.stok_produk}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-3 text-xs">
                                                <p>
                                                    Minimum Stok: <br />
                                                    <span className="font-bold">
                                                        {i.stok_minimum_produk}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-3 text-xs">
                                                <p>
                                                    Pembuat: <br />
                                                    <span className="font-bold">
                                                        {i.user.name}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="text-[10px] group-hover:block hidden absolute z-20 bottom-20 mb-5 right-5 cursor-pointer bg-green-300 p-2 rounded-md"
                                            onClick={(e) =>
                                                handleCreateProduksi(i.id)
                                            }
                                        >
                                            <p>Buat produksi</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {createProduksi && (
                                <div className="w-96 p-5 border rounded-lg">
                                    <div className="flex justify-end">
                                        <div
                                            className="bg-pink-500 p-2 rounded-md text-center  cursor-pointer w-7"
                                            onClick={() =>
                                                setCreateProduksi(false)
                                            }
                                        >
                                            <img
                                                src="/assets/icons/plus.png"
                                                alt=""
                                                className="w-3 h-3 rotate-45"
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="text-center">
                                            <div className="bg-green-500/20 border-dashed mt-3 p-2 rounded-lg">
                                                <p className="font-black mb-1">
                                                    {data.id_produk}
                                                </p>
                                                <p>{data.nama_produk}</p>
                                            </div>
                                        </div>
                                        <form
                                            action=""
                                            className="mt-5"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="">
                                                <InputLabel
                                                    htmlFor="id_produksi"
                                                    value="Id Produksi"
                                                />
                                                <TextInput
                                                    id="id_produksi"
                                                    type="text"
                                                    name="id_produksi"
                                                    value={data.id_produksi}
                                                    className="mt-1 block w-full"
                                                    autoComplete="id_produksi"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "id_produksi",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.id_produksi}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <TextInput
                                                    id="id_produk"
                                                    type="text"
                                                    name="id_produk"
                                                    value={data.id_produk}
                                                    className="mt-1 hidden w-full font-bold text-green-500 bg-green-300/20 border-green-500 capitalize"
                                                    autoComplete="id_produk"
                                                    isFocused={true}
                                                />
                                                <InputError
                                                    message={errors.id_produk}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <TextInput
                                                    id="nama_produk"
                                                    type="text"
                                                    name="nama_produk"
                                                    value={data.nama_produk}
                                                    className="mt-1 hidden w-full font-bold text-green-500 bg-green-300/20 border-green-500 capitalize"
                                                    autoComplete="nama_produk"
                                                    maxLength={30}
                                                    isFocused={true}
                                                />
                                                <InputError
                                                    message={errors.nama_produk}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <InputLabel
                                                    htmlFor="email"
                                                    value="Jumlah Produksi"
                                                />
                                                <TextInput
                                                    id="jumlah_produksi"
                                                    type="number"
                                                    name="jumlah_produksi"
                                                    value={data.jumlah_produksi}
                                                    className="mt-1 block w-full"
                                                    autoComplete="jumlah_produksi"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "jumlah_produksi",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.jumlah_produksi
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <InputLabel
                                                    htmlFor="tanggal_mulai"
                                                    value="Estimasi Mulai"
                                                />
                                                <TextInput
                                                    id="tanggal_mulai"
                                                    type="date"
                                                    name="tanggal_mulai"
                                                    value={data.tanggal_mulai}
                                                    className="mt-1 block w-full"
                                                    autoComplete="tanggal_mulai"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tanggal_mulai",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.tanggal_mulai
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <InputLabel
                                                    htmlFor="estimasi_selesai"
                                                    value="Estimasi Selesai"
                                                />
                                                <TextInput
                                                    id="estimasi_selesai"
                                                    type="date"
                                                    name="estimasi_selesai"
                                                    value={
                                                        data.estimasi_selesai
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="estimasi_selesai"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "estimasi_selesai",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.estimasi_selesai
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <input
                                                    type="number"
                                                    value={data.user_id}
                                                    name="user_id"
                                                    className="hidden"
                                                />

                                                <input
                                                    type="text"
                                                    value={data.status_produksi}
                                                    name="status_produksi"
                                                    className="hidden"
                                                />
                                            </div>
                                            <div className="flex justify-end mt-10">
                                                <PrimaryButton>
                                                    Tambah
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full mx-auto mt-5">
                            {!tambahBahanBaku && (
                                <div>
                                    <div className="grid grid-cols-3 gap-5 mt-5">
                                        {dataProduksi.map((i) => (
                                            <div
                                                key={i.id}
                                                className="cursor-pointer relative group shadow-lg rounded-xl p-5"
                                            >
                                                <h1 className="font-black uppercase bg-yellow-500/20 text-center p-2 rounded-md mb-2">
                                                    {i.id_produksi}
                                                </h1>
                                                <h1 className="font-black border-b border-dashed pb-2">
                                                    ID: {i.id_produk}
                                                </h1>
                                                <div>
                                                    <Label
                                                        className={"bg-red-500"}
                                                    />
                                                    <p className="capitalize">
                                                        {i.nama_produk}{" "}
                                                        <span className="bg-red-500/20 text-red-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                                            {i.status_produksi}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="flex justify-between">
                                                    <div className="mt-3 text-xs">
                                                        <p>
                                                            Tanggal Mulai:{" "}
                                                            <br />
                                                            <span className="font-bold">
                                                                {
                                                                    i.tanggal_mulai
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 text-xs">
                                                        <p>
                                                            Estimasi Selesai:{" "}
                                                            <br />
                                                            <span className="font-bold">
                                                                {
                                                                    i.estimasi_selesai
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 text-xs">
                                                        <p>
                                                            QTY: <br />
                                                            <span className="font-bold">
                                                                {
                                                                    i.jumlah_produksi
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-[10px] group-hover:block hidden absolute z-20 bottom-20 mb-5 right-5 cursor-pointer bg-green-300 p-2 rounded-md"
                                                    onClick={() =>
                                                        handleBahanBaku(i.id)
                                                    }
                                                >
                                                    <p>Tambah bahan baku</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tambahBahanBaku && (
                                <div className="w-full h-screen">
                                    <BahanBaku
                                        dataBahanBaku={dataBahanBaku}
                                        id={id}
                                        userId={auth.user.id}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarProduksi;
