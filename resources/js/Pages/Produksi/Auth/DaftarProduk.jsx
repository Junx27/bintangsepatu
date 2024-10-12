import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
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

function DaftarProduk({ auth }) {
    const [id, setId] = useState(null);
    const [namaProduk, setNamaProduk] = useState("");
    const [produkId, setIdProduk] = useState("");
    const [stokProduk, setStokProduk] = useState("");
    const [dataProduk, setDataProduk] = useState([]);
    const [open, setOpen] = useState(false);
    const [openCatatan, setOpenCatatan] = useState(false);
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
        catatan: "",
        produk_id: "",
        user_id: auth.user.id,
    });
    const ITEMS_PER_PAGE = 12;

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
    const handleCatatan = (id) => {
        setId(id);
        setOpenCatatan(true);
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
                setNamaProduk(response.data.nama_produk);
                setIdProduk(response.data.id_produk);
                setStokProduk(response.data.stok_produk);
                setData("produk_id", response.data.id);
            };
            fetchSingleData();
        }
        fetchData();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-produk-produksi");
    };
    const handleSubmitCatatan = (e) => {
        e.preventDefault();
        post("/create-catatan-produk-produksi");
    };
    const handleDelete = () => {
        selectedIds.forEach(async (id) => {
            destroy(`/daftar-produk-produksi/${id}`);
        });
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
            <Navbar navbar={navbarProduksi} title={"Daftar Produk"}>
                <div className="flex">
                    <div className="w-full relative">
                        <Table
                            header={[
                                "",
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
                            {getCurrentPageData().map((i) => (
                                <tr
                                    key={i.id}
                                    className={`hover:bg-blue-50 cursor-pointer ${
                                        isSelected(i.id) ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <td className="border px-3 py-2 w-10">
                                        <input
                                            type="checkbox"
                                            id={`select-${i.id}`}
                                            className="rounded outline-0"
                                            checked={isSelected(i.id)}
                                            onChange={(e) =>
                                                handleCheckboxChange(e, i.id)
                                            }
                                        />
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
                                    </td>
                                    <td className="px-5 py-2 border">
                                        <FormaterRupiah
                                            number={i.harga_produk}
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <div className="relative">
                                            <FormaterRupiah
                                                className={`relative ml-3 p-1 ${
                                                    i.stok_produk >
                                                    i.stok_minimum_produk
                                                        ? "text-green-600"
                                                        : i.stok_produk ===
                                                          i.stok_minimum_produk
                                                        ? "text-purple-500"
                                                        : "text-red-600"
                                                }`}
                                                number={
                                                    i.stok_produk *
                                                    i.harga_produk
                                                }
                                            />
                                            {!open && !openCatatan && (
                                                <span className="absolute bottom-0 truncate right-0 rounded-full text-[8px] h-5 w-12 font-normal px-2 bg-green-500/20 text-green-600 overflow-hidden">
                                                    {i.stok_produk !== 0
                                                        ? `+${(
                                                              (i.stok_produk /
                                                                  i.stok_minimum_produk) *
                                                              100
                                                          ).toFixed(0)}`
                                                        : `0`}
                                                    %
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-2 border border-r-0">
                                        <div className="flex justify-between items-center">
                                            <p>{i.stok_minimum_produk} pcs</p>
                                            <div
                                                className="hover:bg-blue-100 p-2 rounded-md"
                                                onClick={() => {
                                                    handleCatatan(i.id),
                                                        setOpen(false);
                                                }}
                                            >
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
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!openCatatan && (
                                <p
                                    className={`bg-yellow-300 group flex p-2 rounded-md absolute -top-9 cursor-pointer ${
                                        open ? "-right-10" : "right-2"
                                    }`}
                                    onClick={() => setOpen(!open)}
                                >
                                    <img
                                        src="/assets/icons/plus.png"
                                        alt=""
                                        className={`w-3 h-3 ${
                                            open ? "rotate-45" : ""
                                        }`}
                                    />
                                </p>
                            )}
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
                    <div
                        className={`transisition-all duration-500 bg-white border-l h-screen ${
                            open ? "w-96" : "w-0 opacity-0"
                        }`}
                    >
                        <form
                            action=""
                            className={`p-5 ${
                                open ? "block" : "hidden opacity-0"
                            }`}
                            onSubmit={handleSubmit}
                        >
                            <h1 className="font-bold pt-5 text-center truncate">
                                Menambahkan Produk
                            </h1>
                            <div className="mt-5 border-t border-dashed pt-5">
                                <InputLabel htmlFor="email" value="Id Produk" />
                                <TextInput
                                    id="id_produk"
                                    type="text"
                                    name="id_produk"
                                    value={data.id_produk}
                                    className="mt-1 block w-full"
                                    autoComplete="id_produk"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("id_produk", e.target.value)
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
                                        setData("nama_produk", e.target.value)
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
                                        setData("harga_produk", e.target.value)
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
                    </div>
                    {openCatatan && (
                        <PopOver>
                            <div className="-mt-32 w-96">
                                <div className="flex justify-end p-5">
                                    <p
                                        className="bg-yellow-300 group flex p-2 rounded-md w-7 cursor-pointer"
                                        onClick={() =>
                                            setOpenCatatan(!openCatatan)
                                        }
                                    >
                                        <img
                                            src="/assets/icons/plus.png"
                                            alt=""
                                            className={`w-3 h-3 ${
                                                openCatatan ? "rotate-45" : ""
                                            }`}
                                        />
                                    </p>
                                </div>

                                <form
                                    action=""
                                    className="shadow-lg p-5 rounded-xl"
                                    onSubmit={handleSubmitCatatan}
                                >
                                    <h1 className="font-bold -mt-10 text-center truncate">
                                        Menambahkan Catatan
                                    </h1>
                                    <div className="text-sm mt-5 flex flex-col gap-2 border-b border-dashed pb-5">
                                        <p className="">
                                            Penerima:
                                            <span className="truncate font-normal uppercase text-green-500 bg-green-500/20 p-1 rounded-md text-xs mx-2">
                                                Tim Gudang
                                            </span>
                                        </p>
                                        <p className="border-t border-dashed pt-2">
                                            Detail:
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">
                                                {produkId} <br />
                                                <Label
                                                    className={"bg-blue-500"}
                                                />
                                                <span className="font-normal capitalize">
                                                    {namaProduk}
                                                </span>
                                            </p>
                                            <p className="mr-10">
                                                Stok: <br />
                                                <span className="font-bold">
                                                    {stokProduk}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        <InputLabel
                                            htmlFor="nama_produk"
                                            value="Tambahakan Catatan"
                                        />
                                        <textarea
                                            type="text"
                                            name="catatan"
                                            id=""
                                            value={data.catatan}
                                            onChange={(e) =>
                                                setData(
                                                    "catatan",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full mt-2 rounded-md border-dashed"
                                            rows={5}
                                        ></textarea>
                                        <input
                                            type="number"
                                            value={data.produk_id}
                                            name="produk_id"
                                            className="hidden"
                                        />
                                        <input
                                            type="number"
                                            value={data.user_id}
                                            name="user_id"
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <PrimaryButton>Kirim</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </PopOver>
                    )}
                </div>
            </Navbar>
        </RoleAccess>
    );
}

export default DaftarProduk;
