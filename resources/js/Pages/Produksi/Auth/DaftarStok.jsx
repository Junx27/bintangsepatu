import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import Table from "@/Layouts/Tabel";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import PopOver from "@/Components/PopOver";
import Pagination from "@/Layouts/Pagination";
import Label from "@/Components/Label";
import NavbarProduksi from "../Layouts/NavbarProduksi";

function DaftarStok({ auth }) {
    const [id, setId] = useState(null);
    const [namaProduk, setNamaProduk] = useState("");
    const [produkId, setIdProduk] = useState("");
    const [stokProduk, setStokProduk] = useState("");
    const [dataProduk, setDataProduk] = useState([]);
    const [openCatatan, setOpenCatatan] = useState(false);
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors } = useForm({
        id_produk: "",
        nama_produk: "",
        harga_produk: "",
        stok_produk: "",
        stok_minimum_produk: "",
        catatan: "",
        bahan_baku_id: "",
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
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataProduk(response.data);
        };
        if (id !== null) {
            const fetchSingleData = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/bahan-baku/${id}`
                );
                setNamaProduk(response.data.nama_bahan_baku);
                setIdProduk(response.data.id_bahan_baku);
                setStokProduk(response.data.stok_bahan_baku);
                setData("bahan_baku_id", response.data.id);
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
        post("/create-catatan-stok-produksi");
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
            <NavbarProduksi navbar={navbarProduksi} title={"Daftar Stok"}>
                <div className="flex ml-12 pl-2 mt-2">
                    <div className="w-full relative">
                        <Table
                            header={[
                                "Id Bahan Baku",
                                "Nama Bahan Baku",
                                "Stok Bahan Baku",
                                "Minimum Stok",
                                "Satuan Bahan Baku",
                                "Harga Bahan Baku",
                            ]}
                        >
                            {getCurrentPageData().map((i) => (
                                <tr
                                    key={i.id}
                                    className="hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleCatatan(i.id)}
                                >
                                    <td className="px-5 py-2 border font-bold uppercase">
                                        {i.id_bahan_baku}
                                    </td>
                                    <td className="px-5 py-2 border w-64">
                                        <p className="capitalize">
                                            {i.nama_bahan_baku}
                                        </p>
                                    </td>
                                    <td className="px-5 py-2 border">
                                        {i.stok_bahan_baku}
                                        <span
                                            className={`relative ml-3 rounded-full text-center p-1 text-[10px] font-normal pl-5 pr-3 ${
                                                i.stok_bahan_baku >
                                                i.minimum_stok
                                                    ? "bg-green-500/20 text-green-600"
                                                    : i.stok_bahan_baku ===
                                                      i.minimum_stok
                                                    ? "bg-purple-500/20 text-purple-500"
                                                    : "bg-red-500/20 text-red-600"
                                            }`}
                                        >
                                            {i.stok_bahan_baku > i.minimum_stok
                                                ? "+aman"
                                                : i.stok_bahan_baku ===
                                                  i.minimum_stok
                                                ? "+cukup"
                                                : "-kurang"}
                                            <span
                                                className={`inset-0 absolute w-2 h-2 top-[6px] left-1 rounded-full animate-pulse ${
                                                    i.stok_bahan_baku >
                                                    i.minimum_stok
                                                        ? "bg-green-500"
                                                        : i.stok_bahan_baku ===
                                                          i.minimum_stok
                                                        ? "bg-purple-500"
                                                        : "bg-red-500"
                                                }`}
                                            ></span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-2 border">
                                        <div className="relative">
                                            {i.minimum_stok}
                                            {!open && (
                                                <span className="absolute truncate bottom-0 right-0 rounded-full text-[8px] h-5 w-12  font-normal px-2 bg-green-500/20 text-green-600 overflow-hidden">
                                                    +
                                                    {(
                                                        (i.stok_bahan_baku /
                                                            i.minimum_stok) *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border">
                                        {i.satuan_bahan_baku}
                                    </td>
                                    <td className="px-5 py-2 border border-r-0">
                                        {i.harga_bahan_baku}
                                    </td>
                                </tr>
                            ))}
                            {openCatatan && (
                                <p
                                    className={`bg-yellow-300 group flex p-2 rounded-md absolute -top-9 cursor-pointer ${
                                        openCatatan ? "-right-10" : "right-2"
                                    }`}
                                    onClick={() => setOpenCatatan(!openCatatan)}
                                >
                                    <img
                                        src="/assets/icons/plus.png"
                                        alt=""
                                        className={`w-3 h-3 ${
                                            openCatatan ? "rotate-45" : ""
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
                            openCatatan ? "w-96" : "w-0 opacity-0"
                        }`}
                    >
                        <form
                            action=""
                            className={`p-5 ${
                                openCatatan ? "block" : "hidden opacity-0"
                            }`}
                            onSubmit={handleSubmitCatatan}
                        >
                            <h1 className="font-bold pt-10 text-center truncate">
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
                                        <Label className={"bg-blue-500"} />
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
                                        setData("catatan", e.target.value)
                                    }
                                    className="w-full mt-2 rounded-md border-dashed"
                                    rows={5}
                                ></textarea>
                                <input
                                    type="number"
                                    value={data.bahan_baku_id}
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
                </div>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarStok;
