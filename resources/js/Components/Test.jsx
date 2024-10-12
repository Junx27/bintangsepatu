import React, { useState } from "react";
import Label from "./Label";
import PrimaryButton from "./PrimaryButton";
import Empty from "./Empty";
import { useForm } from "@inertiajs/react";

const Test = ({ dataBahanBaku, id, userId }) => {
    const [jumlah, setJumlah] = useState("");
    const [selectedBahanBaku, setSelectedBahanBaku] = useState(null);
    const [filterIds, setFilterIds] = useState([]);
    const { data, setData, post } = useForm({ produksi: [] });

    const handleAddProduksi = () => {
        if (id && selectedBahanBaku && jumlah) {
            const jumlahInt = parseInt(jumlah);
            const remainingStock = calculateRemainingStock(selectedBahanBaku);

            if (jumlahInt <= 0) {
                alert("Jumlah harus lebih besar dari 0.");
                return;
            }
            if (jumlahInt > remainingStock) {
                alert(
                    "Jumlah yang dimasukkan melebihi sisa stok yang tersedia."
                );
                return;
            }

            const newProduksi = {
                jumlah_bahan_baku: jumlahInt,
                produksi_id: parseInt(id),
                bahan_baku_id: selectedBahanBaku.id,
                user_id: parseInt(userId),
            };

            setData("produksi", [...data.produksi, newProduksi]);
            setSelectedBahanBaku(null);
            setJumlah("");
        }
    };

    const handleRemoveProduksi = (index) => {
        const newProduksi = data.produksi.filter((_, i) => i !== index);
        setData("produksi", newProduksi);
    };

    const filterData = dataBahanBaku.filter(
        (bahanBaku) => !filterIds.includes(bahanBaku.id)
    );

    const calculateTotalUsed = (bahanBaku) => {
        return data.produksi
            .filter((produksi) => produksi.bahan_baku_id === bahanBaku.id)
            .reduce((acc, produksi) => acc + produksi.jumlah_bahan_baku, 0);
    };

    const calculateRemainingStock = (bahanBaku) => {
        const totalUsed = calculateTotalUsed(bahanBaku);
        return bahanBaku.stok_bahan_baku - totalUsed;
    };

    const handleSubmitAll = () => {
        if (data.produksi.length > 0) {
            console.log(data.produksi);
            post("/create-data-produksi-produksi", { produksi: data.produksi });
        }
    };

    return (
        <div className="w-full flex gap-5 ml-8">
            <div className="w-96 border-r h-screen overflow-auto">
                <h1 className="font-bold sticky top-0 bg-white p-3 uppercase z-20">
                    Daftar Bahan Baku
                </h1>
                <input type="hidden" value={id} />
                <input type="hidden" value={userId} />
                <div className="mt-5 flex flex-col gap-5 mr-5 pb-32">
                    {filterData.map((bahanBaku) => (
                        <div
                            key={bahanBaku.id}
                            className={`hover:bg-blue-50 p-5 cursor-pointer rounded-md border border-blue-200 shadow-lg relative ${
                                selectedBahanBaku?.id === bahanBaku.id
                                    ? "bg-blue-50 shadow-xl"
                                    : ""
                            }`}
                            onClick={() => setSelectedBahanBaku(bahanBaku)}
                        >
                            <h1 className="font-black border-b border-dashed pb-2">
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
                                <p className="capitalize">
                                    {bahanBaku.nama_bahan_baku}
                                </p>
                                <p className="text-xs mt-2">
                                    Tersedia:{" "}
                                    <span className="text-blue-500 font-bold">
                                        {calculateRemainingStock(bahanBaku)}{" "}
                                        {bahanBaku.satuan_bahan_baku}
                                    </span>
                                </p>
                            </div>
                            {selectedBahanBaku?.id === bahanBaku.id && (
                                <div className="inset-0 h-full w-full absolute p-5 bg-white ml-[140px]">
                                    <input
                                        type="number"
                                        value={jumlah}
                                        className="w-[92px] rounded-md"
                                        onChange={(e) =>
                                            setJumlah(e.target.value)
                                        }
                                    />
                                    <div className="mt-2">
                                        <PrimaryButton
                                            onClick={handleAddProduksi}
                                        >
                                            Tambah
                                        </PrimaryButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full">
                {data.produksi.length === 0 ? (
                    <Empty />
                ) : (
                    <div className="relative mt-5 grid grid-cols-3 gap-5 mr-5">
                        {data.produksi.map((produksi, index) => {
                            const bahanBaku = dataBahanBaku.find(
                                (b) => b.id === produksi.bahan_baku_id
                            );
                            if (!bahanBaku) return null;

                            const totalUsed = calculateTotalUsed(bahanBaku);

                            return (
                                <div
                                    key={index}
                                    className="hover:bg-blue-50 cursor-pointer p-5 shadow-lg rounded-md"
                                >
                                    <h1 className="font-black">
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
                                        <p className="capitalize">
                                            {bahanBaku.nama_bahan_baku}
                                        </p>
                                        <div className="flex justify-between">
                                            <p className="text-xs mt-2">
                                                Stok Saat Ini:{" "}
                                                <span className="text-blue-500 font-bold">
                                                    {bahanBaku.stok_bahan_baku}{" "}
                                                    {
                                                        bahanBaku.satuan_bahan_baku
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-xs mt-2">
                                                Jumlah Digunakan:{" "}
                                                <span className="text-red-500 font-bold">
                                                    {totalUsed}{" "}
                                                    {
                                                        bahanBaku.satuan_bahan_baku
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-xs mt-2">
                                                Sisa Stok:{" "}
                                                <span className="text-green-500 font-bold">
                                                    {calculateRemainingStock(
                                                        bahanBaku
                                                    )}{" "}
                                                    {
                                                        bahanBaku.satuan_bahan_baku
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <PrimaryButton
                                                onClick={() =>
                                                    handleRemoveProduksi(index)
                                                }
                                                className="bg-red-600"
                                            >
                                                Remove
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {data.produksi.length !== 0 && (
                    <div className="fixed bottom-10 right-10">
                        <PrimaryButton onClick={handleSubmitAll}>
                            Kirim Semua Data
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;
