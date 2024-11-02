import RoleAccess from "@/Middleware/RoleAccess";
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
import FormateDate from "@/Components/FormateDate";
import FormaterRupiah from "@/Layouts/FormaterRupiah";

function DaftarStok({ auth }) {
    const tanggal = new Date();
    const [id, setId] = useState(null);
    const [namaProduk, setNamaProduk] = useState("");
    const [produkId, setIdProduk] = useState("");
    const [stokProduk, setStokProduk] = useState("");
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
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
    const ITEMS_PER_PAGE = 30;

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const totalPages = Math.ceil(dataBahanBaku.length / ITEMS_PER_PAGE);

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

        let filteredData = dataBahanBaku;

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
            setDataBahanBaku(response.data);
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
                title={"Daftar Stok"}
                auth={auth}
            >
                <div className="flex m-5 ml-20">
                    <div className="w-full relative border p-5 rounded-md">
                        <h1 className="font-black text-xl uppercase text-center">
                            data tabel semua bahan baku
                        </h1>
                        <h2 className="text-center font-bold text-sm">
                            Sistem Informasi Inventori dan Produksi (SIIP)
                        </h2>
                        <p className="text-center text-xs mb-5 border-b-4 border-double border-black pb-2">
                            Tanggal: <FormateDate data={tanggal} />
                        </p>
                        <Table
                            header={[
                                "No",
                                "Id Bahan Baku",
                                "Nama Bahan Baku",
                                "Stok Bahan Baku",
                                "Minimum Stok",
                                "Satuan Bahan Baku",
                                "Harga Bahan Baku",
                            ]}
                        >
                            {getCurrentPageData().map((i, index) => (
                                <tr
                                    key={i.id}
                                    className="hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleCatatan(i.id)}
                                >
                                    <td className="border px-3 py-2">
                                        {index + 1}
                                    </td>
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
                                    </td>
                                    <td className="px-5 py-2 border">
                                        <div className="relative">
                                            {i.minimum_stok}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border">
                                        {i.satuan_bahan_baku}
                                    </td>
                                    <td className="px-5 py-2 border">
                                        <FormaterRupiah
                                            number={i.harga_bahan_baku}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        <div className="mb-5">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                data={dataBahanBaku}
                                jumlahData={dataBahanBaku.length}
                                keterangan={"bahan baku"}
                            />
                        </div>
                    </div>
                </div>
            </NavbarProduksi>
        </RoleAccess>
    );
}

export default DaftarStok;
