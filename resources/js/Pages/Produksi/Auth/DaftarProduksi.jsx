import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import axios from "axios";
import Label from "@/Components/Label";
import Table from "@/Layouts/Tabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PopOver from "@/Components/PopOver";
import Test from "@/Components/Test";
import Empty from "@/Components/Empty";

function DaftarProduksi({ auth }) {
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
            <Navbar navbar={navbarProduksi} title={"Daftar Produksi"}>
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
                <div className="relative ml-12 text-sm flex gap-5 mr-5">
                    {!createProduksi && !tambahBahanBaku && (
                        <div className="w-[500px] h-screen border-r overflow-auto">
                            <h1 className="font-bold sticky top-2 bg-white py-4 px-10 text-center mt-5 border-b uppercase z-20">
                                daftar produk
                            </h1>
                            <div className="grid grid-cols-1 gap-5 mt-5 pb-20 p-5">
                                {dataProduk.map((i) => (
                                    <div
                                        key={i.id}
                                        className="hover:bg-blue-50 cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <h1 className="font-black border-b border-dashed pb-2">
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
                                            className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                            onClick={(e) =>
                                                handleCreateProduksi(i.id)
                                            }
                                        >
                                            <img
                                                src="/assets/icons/plus.png"
                                                alt=""
                                                className="w-7 h-7 bg-green-300 p-2 rounded-md"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {createProduksi && (
                        <div className="w-[500px] mx-auto border-r h-screen">
                            <div className="flex justify-end mt-10 mr-5">
                                <div
                                    className="bg-yellow-300 p-2 rounded-md text-center  cursor-pointer w-7"
                                    onClick={() => setCreateProduksi(false)}
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
                                    <h1 className="font-bold text-center truncate uppercase mt-3">
                                        Membuat Produksi Produk
                                    </h1>
                                    <div className="border border-green-500 bg-green-500/20 border-dashed mx-5 mt-3 p-2 rounded-lg">
                                        <p className="font-black mb-1">
                                            {data.id_produk}
                                        </p>
                                        <p>{data.nama_produk}</p>
                                    </div>
                                </div>
                                <form
                                    action=""
                                    className="p-5"
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
                                            message={errors.jumlah_produksi}
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
                                            message={errors.tanggal_mulai}
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
                                            value={data.estimasi_selesai}
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
                                            message={errors.estimasi_selesai}
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
                                        <PrimaryButton>Tambah</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {dataProduksi.length === 0 ? (
                        <div className="w-full">
                            <Empty />
                        </div>
                    ) : (
                        <div className="w-full mx-auto mt-5">
                            {!tambahBahanBaku && (
                                <div className="grid grid-cols-3 gap-5 mt-5">
                                    {dataProduksi.map((i) => (
                                        <div
                                            key={i.id}
                                            className="hover:bg-blue-50 cursor-pointer relative group shadow-lg rounded-xl p-5"
                                        >
                                            <h1 className="font-black uppercase bg-yellow-500/20 text-center p-2 border border-dashed border-yellow-500 rounded-md mb-2">
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
                                                        Tanggal Mulai: <br />
                                                        <span className="font-bold">
                                                            {i.tanggal_mulai}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        Estimasi Selesai: <br />
                                                        <span className="font-bold">
                                                            {i.estimasi_selesai}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs">
                                                    <p>
                                                        QTY: <br />
                                                        <span className="font-bold">
                                                            {i.jumlah_produksi}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                                onClick={() =>
                                                    handleBahanBaku(i.id)
                                                }
                                            >
                                                <img
                                                    src="/assets/icons/plus.png"
                                                    alt=""
                                                    className="w-7 h-7 bg-green-300 p-2 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {tambahBahanBaku && (
                                <div className="w-full h-screen">
                                    <Test
                                        dataBahanBaku={dataBahanBaku}
                                        id={id}
                                        userId={auth.user.id}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Navbar>
        </RoleAccess>
    );
}

export default DaftarProduksi;
