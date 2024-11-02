import React, { useEffect, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import Label from "@/Components/Label";
import { useForm } from "@inertiajs/react";
import RoleAccess from "@/Middleware/RoleAccess";
import NotificationSuccess from "@/Components/NotificationSuccess";
import PopOver from "@/Components/PopOver";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Pagination from "@/Layouts/Pagination";
import Table from "@/Layouts/Tabel";
import axios from "axios";

function BahanBaku({ auth }) {
    const navigasi = [
        {
            nama: "daftar semua bahan baku",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "tambah bahan baku",
            icon: "/assets/icons/add-product.png",
        },
        {
            nama: "tambah bahan baku masuk",
            icon: "/assets/icons/stock.png",
        },
    ];
    const [view, setView] = useState("daftar semua bahan baku");
    const [openEditBahanBaku, setOpenEditBahanBaku] = useState(false);
    const [openUpdateBahanBaku, setOpenUpdateBahanBaku] = useState(false);
    const [bahanBakuId, setBahanBakuId] = useState(null);
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [sukses, setSuccess] = useState(false);
    const [preview, setPreview] = useState(null);
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
    } = useForm({
        id_bahan_baku: "",
        nama_bahan_baku: "",
        stok_bahan_baku: 0,
        minimum_stok: 0,
        satuan_bahan_baku: "",
        harga_bahan_baku: "",
        gambar_bahan_baku: "",
        tanggal_masuk: "",
        stok_masuk: 0,
        user_id: auth.user.id,
    });
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setData("gambar_bahan_baku", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/api/bintangsepatu/bahan-bakus"
                );
                setDataBahanBaku(response.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        const fetchSingleData = async (id) => {
            try {
                const response = await axios.get(
                    `/api/bintangsepatu/bahan-baku/${id}`
                );
                setData({
                    _method: "PUT",
                    id_bahan_baku: response.data.id_bahan_baku,
                    nama_bahan_baku: response.data.nama_bahan_baku,
                    satuan_bahan_baku: response.data.satuan_bahan_baku,
                    harga_bahan_baku: response.data.harga_bahan_baku,
                    minimum_stok: response.data.minimum_stok,
                    gambar_bahan_baku: response.data.gambar_bahan_baku,
                });
            } catch (error) {
                console.error("Failed to fetch single data", error);
            }
        };

        if (bahanBakuId !== null) {
            fetchSingleData(bahanBakuId);
        }
        fetchData();
    }, [bahanBakuId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/bahan-baku-gudang").then(() => setSuccess(true));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        post(`/bahan-baku-gudang/${bahanBakuId}`);
    };
    const handleUpdateStok = (e) => {
        e.preventDefault();
        put(`/bahan-baku-gudang-stok/${bahanBakuId}`);
    };

    const handleDeleteBahanBaku = (id) => {
        destroy(`/bahan-baku-gudang/${id}`);
    };

    const handleEditBahanBaku = (id) => {
        setBahanBakuId(id);
        setOpenEditBahanBaku(true);
    };
    const handleUpdateStokBahanBaku = (id) => {
        setBahanBakuId(id);
        setOpenUpdateBahanBaku(true);
    };

    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(dataBahanBaku.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return dataBahanBaku.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    return (
        <RoleAccess auth={auth} role={"gudang"}>
            {errors.message && (
                <PopOver>
                    <div className="flex flex-col items-center bg-white p-5 rounded w-96">
                        <p className="text-center mb-5">{errors.message}</p>
                        <PrimaryButton onClick={() => window.location.reload()}>
                            Coba lagi
                        </PrimaryButton>
                    </div>
                </PopOver>
            )}

            <NavbarGudang
                navbar={navbarGudang}
                title={"Bahan Baku"}
                auth={auth}
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
                {sukses && (
                    <NotificationSuccess message={"berhasil memasukan data"} />
                )}
                <div className="ml-20 mt-5 mr-5">
                    {view === "daftar semua bahan baku" ? (
                        <div>
                            {openEditBahanBaku && (
                                <div className="">
                                    <div className="flex gap-10">
                                        <form
                                            onSubmit={handleUpdate}
                                            className="w-96 p-5 border border-dashed border-pink-500 rounded-lg"
                                        >
                                            <div className="flex justify-between gap-2 items-center font-bold border-b border-dashed pb-3">
                                                <div className="flex gap-2 items-center">
                                                    <Label
                                                        className={
                                                            "bg-green-500"
                                                        }
                                                        rotate={"rotate-90"}
                                                    />
                                                    <p>Mengubah bahan baku</p>
                                                </div>

                                                <div className="flex justify-end">
                                                    <p
                                                        className="bg-yellow-300 p-2 rounded-md w-7 cursor-pointer"
                                                        onClick={() =>
                                                            setOpenEditBahanBaku(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="/assets/icons/plus.png"
                                                            alt=""
                                                            className="w-3 h-3 rotate-45"
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="my-5">
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    className="mt-2 block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-700
                                       hover:file:bg-blue-100"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            {[
                                                "id_bahan_baku",
                                                "nama_bahan_baku",
                                                "satuan_bahan_baku",
                                                "harga_bahan_baku",
                                                "minimum_stok",
                                            ].map((field) => (
                                                <div
                                                    className="my-3"
                                                    key={field}
                                                >
                                                    <InputLabel
                                                        htmlFor={field}
                                                        value={field.replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                    />
                                                    <TextInput
                                                        id={field}
                                                        type={
                                                            field ===
                                                                "harga_bahan_baku" ||
                                                            field ===
                                                                "minimum_stok"
                                                                ? "number"
                                                                : "text"
                                                        }
                                                        name={field}
                                                        value={data[field]}
                                                        className="mt-1 block w-full"
                                                        autoComplete={field}
                                                        onChange={handleChange}
                                                    />
                                                    <InputError
                                                        message={errors[field]}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            ))}
                                            <div className="flex justify-end mt-5">
                                                <PrimaryButton>
                                                    Simpan
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                        <div className="w-96 h-96">
                                            <div className="flex gap-2 items-center font-bold border-b border-dashed pb-3">
                                                <Label
                                                    className={"bg-green-500"}
                                                    rotate={"rotate-90"}
                                                />
                                                <p>Preview</p>
                                            </div>
                                            <img
                                                src={`${
                                                    preview === null
                                                        ? `storage/${data.gambar_bahan_baku}`
                                                        : preview
                                                }`}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg mx-auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div
                                className={`w-full relative h-screen overflow-auto pb-32 ${
                                    openEditBahanBaku ? "hidden" : "block"
                                }`}
                            >
                                <div className="grid grid-cols-5 gap-5 mr-5 pb-32">
                                    {dataBahanBaku.map((bahanBaku) => (
                                        <div
                                            key={bahanBaku.id}
                                            className={`group p-5 cursor-pointer rounded-md shadow-lg relative `}
                                        >
                                            <div className="w-full h-32">
                                                <img
                                                    src={`storage/${bahanBaku.gambar_bahan_baku}`}
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <h1 className="font-black border-b border-dashed pb-2 mt-2">
                                                {bahanBaku.id_bahan_baku}
                                            </h1>
                                            <div>
                                                <Label
                                                    className={
                                                        bahanBaku.stok_produk >
                                                        bahanBaku.stok_minimum_produk
                                                            ? "bg-green-600"
                                                            : bahanBaku.stok_produk ===
                                                              bahanBaku.stok_minimum_produk
                                                            ? "bg-purple-500"
                                                            : "bg-red-600"
                                                    }
                                                />
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="capitalize">
                                                            {
                                                                bahanBaku.nama_bahan_baku
                                                            }
                                                            <span
                                                                className={`relative ml-3 rounded-full text-center p-1 text-[10px] font-normal pl-5 pr-3 ${
                                                                    bahanBaku.stok_bahan_baku >
                                                                    bahanBaku.minimum_stok
                                                                        ? "bg-green-500/20 text-green-600"
                                                                        : bahanBaku.stok_bahan_baku ===
                                                                          bahanBaku.minimum_stok
                                                                        ? "bg-purple-500/20 text-purple-500"
                                                                        : "bg-red-500/20 text-red-600"
                                                                }`}
                                                            >
                                                                {bahanBaku.stok_bahan_baku >
                                                                bahanBaku.minimum_stok
                                                                    ? "+aman"
                                                                    : bahanBaku.stok_bahan_baku ===
                                                                      bahanBaku.minimum_stok
                                                                    ? "+cukup"
                                                                    : "-kurang"}
                                                                <span
                                                                    className={`inset-0 absolute w-2 h-2 top-[6px] left-1 rounded-full animate-pulse ${
                                                                        bahanBaku.stok_bahan_baku >
                                                                        bahanBaku.minimum_stok
                                                                            ? "bg-green-500"
                                                                            : bahanBaku.stok_bahan_baku ===
                                                                              bahanBaku.minimum_stok
                                                                            ? "bg-purple-500"
                                                                            : "bg-red-500"
                                                                    }`}
                                                                ></span>
                                                            </span>
                                                        </p>
                                                        <p className="text-xs mt-2"></p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <p>
                                                        Stok bahan baku: <br />
                                                        {
                                                            bahanBaku.stok_bahan_baku
                                                        }
                                                    </p>
                                                    <p>
                                                        Minimum stok: <br />
                                                        {bahanBaku.minimum_stok}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="group-hover:block hidden absolute z-20 bottom-20 mb-6 right-5 cursor-pointer">
                                                <div className="flex gap-2">
                                                    <img
                                                        src="/assets/icons/edit-button.png"
                                                        alt=""
                                                        className="w-5 h-5"
                                                        onClick={() =>
                                                            handleEditBahanBaku(
                                                                bahanBaku.id
                                                            )
                                                        }
                                                    />
                                                    <img
                                                        src="/assets/icons/remove.png"
                                                        alt=""
                                                        className="w-5 h-5"
                                                        onClick={() =>
                                                            handleDeleteBahanBaku(
                                                                bahanBaku.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : view === "tambah bahan baku" ? (
                        <div className="flex gap-10">
                            <form
                                onSubmit={handleSubmit}
                                className="w-96 p-5 border rounded-lg"
                            >
                                <div className="flex gap-2 items-center font-bold border-b border-dashed pb-3">
                                    <Label
                                        className={"bg-green-500"}
                                        rotate={"rotate-90"}
                                    />
                                    <p>Menambahkan bahan baku</p>
                                </div>
                                <div className="my-5">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="mt-2 block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-700
                                       hover:file:bg-blue-100"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {[
                                    "id_bahan_baku",
                                    "nama_bahan_baku",
                                    "satuan_bahan_baku",
                                    "harga_bahan_baku",
                                    "minimum_stok",
                                ].map((field) => (
                                    <div className="my-3" key={field}>
                                        <InputLabel
                                            htmlFor={field}
                                            value={field.replace(/_/g, " ")}
                                        />
                                        <TextInput
                                            id={field}
                                            type={
                                                field === "harga_bahan_baku" ||
                                                field === "minimum_stok"
                                                    ? "number"
                                                    : "text"
                                            }
                                            name={field}
                                            value={data[field]}
                                            className="mt-1 block w-full"
                                            autoComplete={field}
                                            onChange={handleChange}
                                        />
                                        <InputError
                                            message={errors[field]}
                                            className="mt-2"
                                        />
                                    </div>
                                ))}
                                <div className="flex justify-end mt-5">
                                    <PrimaryButton>Tambah</PrimaryButton>
                                </div>
                            </form>
                            <div className="w-96 h-96">
                                <div className="flex gap-2 items-center font-bold border-b border-dashed pb-3">
                                    <Label
                                        className={"bg-green-500"}
                                        rotate={"rotate-90"}
                                    />
                                    <p>Preview</p>
                                </div>
                                <img
                                    src={`${
                                        preview === null
                                            ? "assets/clipboard.png"
                                            : preview
                                    }`}
                                    alt=""
                                    className="w-full h-full object-cover rounded-lg mx-auto"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-screen overflow-auto pb-32">
                            {openUpdateBahanBaku && (
                                <div>
                                    <div className="flex flex-col items-center bg-white p-5 rounded w-96">
                                        <form
                                            onSubmit={handleUpdateStok}
                                            className="w-96 mx-auto p-5 border rounded-lg"
                                        >
                                            <div className="flex justify-between gap-2 items-center font-bold border-b border-dashed pb-3">
                                                <div className="flex gap-2 items-center">
                                                    <h1 className="font-black mt-1">
                                                        ID: {data.id_bahan_baku}
                                                    </h1>
                                                </div>
                                                <div className="flex justify-end">
                                                    <p
                                                        className="bg-pink-500 p-2 rounded-md w-7 cursor-pointer"
                                                        onClick={() =>
                                                            setOpenUpdateBahanBaku(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="/assets/icons/plus.png"
                                                            alt=""
                                                            className="w-3 h-3 rotate-45"
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <Label
                                                    className={"bg-green-500"}
                                                />
                                                {data.nama_bahan_baku}
                                            </div>
                                            {[
                                                "stok_masuk",
                                                "tanggal_masuk",
                                            ].map((field) => (
                                                <div
                                                    className="my-3"
                                                    key={field}
                                                >
                                                    <InputLabel
                                                        htmlFor={field}
                                                        value={field.replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                    />
                                                    <TextInput
                                                        id={field}
                                                        type={
                                                            field ===
                                                            "stok_masuk"
                                                                ? "number"
                                                                : "date"
                                                        }
                                                        name={field}
                                                        value={data[field]}
                                                        className="mt-1 block w-full"
                                                        autoComplete={field}
                                                        onChange={handleChange}
                                                    />
                                                    <InputError
                                                        message={errors[field]}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            ))}
                                            <div className="flex justify-end mt-5">
                                                <PrimaryButton>
                                                    update stok
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            <div
                                className={`grid grid-cols-5 gap-5 mr-5 pb-32 ${
                                    openUpdateBahanBaku ? "hidden" : "block"
                                }`}
                            >
                                {dataBahanBaku.map((bahanBaku) => (
                                    <div
                                        key={bahanBaku.id}
                                        className={`group p-5 cursor-pointer rounded-md shadow-lg relative `}
                                    >
                                        <div className="w-full h-32">
                                            <img
                                                src={`storage/${bahanBaku.gambar_bahan_baku}`}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <h1 className="font-black border-b border-dashed pb-2 mt-2">
                                            {bahanBaku.id_bahan_baku}
                                        </h1>
                                        <div>
                                            <Label
                                                className={
                                                    bahanBaku.stok_produk >
                                                    bahanBaku.stok_minimum_produk
                                                        ? "bg-green-600"
                                                        : bahanBaku.stok_produk ===
                                                          bahanBaku.stok_minimum_produk
                                                        ? "bg-purple-500"
                                                        : "bg-red-600"
                                                }
                                            />
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="capitalize">
                                                        {
                                                            bahanBaku.nama_bahan_baku
                                                        }
                                                        <span
                                                            className={`relative ml-3 rounded-full text-center p-1 text-[10px] font-normal pl-5 pr-3 ${
                                                                bahanBaku.stok_bahan_baku >
                                                                bahanBaku.minimum_stok
                                                                    ? "bg-green-500/20 text-green-600"
                                                                    : bahanBaku.stok_bahan_baku ===
                                                                      bahanBaku.minimum_stok
                                                                    ? "bg-purple-500/20 text-purple-500"
                                                                    : "bg-red-500/20 text-red-600"
                                                            }`}
                                                        >
                                                            {bahanBaku.stok_bahan_baku >
                                                            bahanBaku.minimum_stok
                                                                ? "+aman"
                                                                : bahanBaku.stok_bahan_baku ===
                                                                  bahanBaku.minimum_stok
                                                                ? "+cukup"
                                                                : "-kurang"}
                                                            <span
                                                                className={`inset-0 absolute w-2 h-2 top-[6px] left-1 rounded-full animate-pulse ${
                                                                    bahanBaku.stok_bahan_baku >
                                                                    bahanBaku.minimum_stok
                                                                        ? "bg-green-500"
                                                                        : bahanBaku.stok_bahan_baku ===
                                                                          bahanBaku.minimum_stok
                                                                        ? "bg-purple-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            ></span>
                                                        </span>
                                                    </p>
                                                    <p className="text-xs mt-2"></p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <p>
                                                    Stok bahan baku: <br />
                                                    {bahanBaku.stok_bahan_baku}
                                                </p>
                                                <p>
                                                    Minimum stok: <br />
                                                    {bahanBaku.minimum_stok}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="text-[10px] group-hover:block hidden absolute z-20 bottom-20 mb-4 right-5 cursor-pointer bg-green-300 p-2 rounded-md"
                                            onClick={() =>
                                                handleUpdateStokBahanBaku(
                                                    bahanBaku.id
                                                )
                                            }
                                        >
                                            <p>Update stok</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default BahanBaku;
