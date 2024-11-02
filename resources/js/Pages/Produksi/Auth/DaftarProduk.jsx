import RoleAccess from "@/Middleware/RoleAccess";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import Table from "@/Layouts/Tabel";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import PopOver from "@/Components/PopOver";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Pagination from "@/Layouts/Pagination";
import Label from "@/Components/Label";
import NavbarProduksi from "../Layouts/NavbarProduksi";
import FormateDate from "@/Components/FormateDate";

function DaftarProduk({ auth }) {
    const navigasi = [
        {
            nama: "data semua produk",
            icon: "/assets/icons/product.png",
        },
        {
            nama: "data tabel semua produk",
            icon: "/assets/icons/table.png",
        },
        {
            nama: "tambah produk baru",
            icon: "/assets/icons/add-product.png",
        },
    ];
    const tanggal = new Date();
    const [view, setView] = useState("data semua produk");
    const [openEdit, setOpenEdit] = useState(false);
    const [id, setId] = useState(null);
    const [namaProduk, setNamaProduk] = useState("");
    const [produkId, setIdProduk] = useState("");
    const [stokProduk, setStokProduk] = useState("");
    const [dataProduk, setDataProduk] = useState([]);
    const [preview, setPreview] = useState(null);
    const {
        data,
        setData,
        post,
        delete: destroy,
        errors,
    } = useForm({
        id_produk: "",
        nama_produk: "",
        harga_produk: "",
        gambar_produk: null,
        catatan: "",
        produk_id: "",
        user_id: auth.user.id,
    });
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setData("gambar_produk", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const ITEMS_PER_PAGE = 30;

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const totalPages = Math.ceil(dataProduk.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id)
            );
        }
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        let filteredData = dataProduk;

        return filteredData.slice(startIndex, endIndex);
    };

    const isSelected = (id) => {
        return selectedIds.includes(id);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataProduk(response.data);
        };
        if (id !== null) {
            const fetchSingleData = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/produk/${id}`
                );
                setData({
                    _method: "PUT",
                    id_produk: response.data.id_produk,
                    nama_produk: response.data.nama_produk,
                    harga_produk: response.data.harga_produk,
                    gambar_produk: response.data.gambar_produk,
                });
            };
            fetchSingleData();
        }
        fetchData();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-produk-produksi");
    };
    const handleDelete = (id) => {
        destroy(`/daftar-produk-produksi/${id}`);
    };
    const handleUpdate = (id) => {
        setId(id);
        setOpenEdit(true);
    };
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        post(`/update-produk-produksi/${id}`);
    };
    return (
        <RoleAccess auth={auth} role={"produksi"}>
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
            <NavbarProduksi
                navbar={navbarProduksi}
                title={"Daftar Produk"}
                auth={auth}
            >
                <div className="m-5 ml-20">
                    <div className="sticky top-0 z-30 text-sm mb-5 flex gap-2 items-center bg-white w-full py-2">
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
                                </div>
                                <div
                                    className={`absolute top-8 w-full h-2 -ml-3 bg-[#0C15F7] transition-opacity duration-300 ${
                                        view === item.nama
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="h-screen overflow-auto pb-32">
                        {view === "data semua produk" ? (
                            <div>
                                {openEdit && (
                                    <div className="flex gap-10">
                                        <form
                                            action=""
                                            className="w-96 p-5 border rounded-lg"
                                            onSubmit={handleSubmitUpdate}
                                        >
                                            <div className="flex justify-between gap-2 items-center font-bold border-b border-dashed pb-3">
                                                <div className="flex items-center gap-2">
                                                    <Label
                                                        className={
                                                            "bg-green-500"
                                                        }
                                                        rotate={"rotate-90"}
                                                    />
                                                    <p>Mengubah produk</p>
                                                </div>
                                                <div className="text-sm">
                                                    <div
                                                        className="bg-pink-400 p-2 rounded-md text-center cursor-pointer w-7"
                                                        onClick={() =>
                                                            window.location.reload()
                                                        }
                                                    >
                                                        <img
                                                            src="/assets/icons/plus.png"
                                                            alt=""
                                                            className="w-3 h-3 rotate-45"
                                                        />
                                                    </div>
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
                                            <div className="mt-5">
                                                <InputLabel
                                                    htmlFor="email"
                                                    value="Id Produk"
                                                />
                                                <TextInput
                                                    id="id_produk"
                                                    type="text"
                                                    name="id_produk"
                                                    value={data.id_produk}
                                                    className="mt-1 block w-full"
                                                    autoComplete="id_produk"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "id_produk",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.id_produk}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <InputLabel
                                                    htmlFor="nama_produk"
                                                    value="Nama Produk"
                                                />
                                                <TextInput
                                                    id="nama_produk"
                                                    type="text"
                                                    name="nama_produk"
                                                    value={data.nama_produk}
                                                    className="mt-1 block w-full"
                                                    autoComplete="nama_produk"
                                                    maxLength={30}
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_produk",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nama_produk}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <InputLabel
                                                    htmlFor="email"
                                                    value="Harga Produk"
                                                />
                                                <TextInput
                                                    id="harga_produk"
                                                    type="number"
                                                    name="harga_produk"
                                                    value={data.harga_produk}
                                                    className="mt-1 block w-full"
                                                    autoComplete="harga_produk"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "harga_produk",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.harga_produk
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="my-4">
                                                <input
                                                    type="number"
                                                    value={auth.user.id}
                                                    name="user_id"
                                                    className="hidden"
                                                />
                                            </div>
                                            <div className="flex gap-5 justify-end mt-10">
                                                <PrimaryButton>
                                                    simpan
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
                                                        ? `storage/${data.gambar_produk}`
                                                        : preview
                                                }`}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg mx-auto"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div
                                    className={`grid grid-cols-4 gap-5 pb-32 mx-5 ${
                                        openEdit ? "hidden" : "block"
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
                                                            {
                                                                i.stok_minimum_produk
                                                            }
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
                                            <div className="group-hover:block hidden absolute z-20 bottom-20 mb-6 right-5 cursor-pointer">
                                                <div className="flex gap-2">
                                                    <img
                                                        src="/assets/icons/edit-button.png"
                                                        alt=""
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() =>
                                                            handleUpdate(i.id)
                                                        }
                                                    />
                                                    <img
                                                        src="/assets/icons/remove.png"
                                                        alt=""
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() =>
                                                            handleDelete(i.id)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : view === "data tabel semua produk" ? (
                            <div className="w-full relative border p-5 rounded-md">
                                <h1 className="font-black text-xl uppercase text-center">
                                    data tabel semua produk
                                </h1>
                                <h2 className="text-center font-bold text-sm">
                                    Sistem Informasi Inventori dan Produksi
                                    (SIIP)
                                </h2>
                                <p className="text-center text-xs mb-5 border-b-4 border-double border-black pb-2">
                                    Tanggal: <FormateDate data={tanggal} />
                                </p>
                                <Table
                                    header={[
                                        "No",
                                        "Id Produk",
                                        "Nama Produk",
                                        "Stok Produk",
                                        "Harga Produk",
                                        "Total Produk",
                                        "Minimun Stok",
                                    ]}
                                >
                                    {selectedIds.length > 0 && (
                                        <div
                                            className="absolute left-3 -top-7"
                                            onClick={handleDelete}
                                        >
                                            <img
                                                src="/assets/icons/remove.png"
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </div>
                                    )}
                                    {getCurrentPageData().map((i, index) => (
                                        <tr
                                            key={i.id}
                                            className={`hover:bg-blue-50 cursor-pointer`}
                                        >
                                            <td className="border px-3 py-2 w-10 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-5 py-2 border font-bold uppercase">
                                                {i.id_produk}
                                            </td>
                                            <td className="px-5 py-2 border w-64">
                                                <p className="capitalize">
                                                    {i.nama_produk}
                                                </p>
                                            </td>
                                            <td className="px-5 py-2 border">
                                                {i.stok_produk} pcs
                                            </td>
                                            <td className="px-5 py-2 border">
                                                <FormaterRupiah
                                                    number={i.harga_produk}
                                                />
                                            </td>
                                            <td className="px-3 py-2 border">
                                                <div className="relative">
                                                    <FormaterRupiah
                                                        number={
                                                            i.stok_produk *
                                                            i.harga_produk
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-5 py-2 border border-r">
                                                <div className="flex justify-between items-center">
                                                    <p>
                                                        {i.stok_minimum_produk}{" "}
                                                        pcs
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                                <div className="mb-5">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        data={dataProduk}
                                        jumlahData={dataProduk.length}
                                        keterangan={"produk"}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-10">
                                <form
                                    action=""
                                    className="w-96 p-5 border rounded-lg"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="flex gap-2 items-center font-bold border-b border-dashed pb-3">
                                        <Label
                                            className={"bg-green-500"}
                                            rotate={"rotate-90"}
                                        />
                                        <p>Menambahkan produk baru</p>
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
                                    <div className="mt-5">
                                        <InputLabel
                                            htmlFor="email"
                                            value="Id Produk"
                                        />
                                        <TextInput
                                            id="id_produk"
                                            type="text"
                                            name="id_produk"
                                            value={data.id_produk}
                                            className="mt-1 block w-full"
                                            autoComplete="id_produk"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    "id_produk",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.id_produk}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="my-4">
                                        <InputLabel
                                            htmlFor="nama_produk"
                                            value="Nama Produk"
                                        />
                                        <TextInput
                                            id="nama_produk"
                                            type="text"
                                            name="nama_produk"
                                            value={data.nama_produk}
                                            className="mt-1 block w-full"
                                            autoComplete="nama_produk"
                                            maxLength={30}
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    "nama_produk",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.nama_produk}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="my-4">
                                        <InputLabel
                                            htmlFor="email"
                                            value="Harga Produk"
                                        />
                                        <TextInput
                                            id="harga_produk"
                                            type="number"
                                            name="harga_produk"
                                            value={data.harga_produk}
                                            className="mt-1 block w-full"
                                            autoComplete="harga_produk"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    "harga_produk",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.harga_produk}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="my-4">
                                        <input
                                            type="number"
                                            value={auth.user.id}
                                            name="user_id"
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-10">
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
                        )}
                    </div>
                </div>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarProduk;
