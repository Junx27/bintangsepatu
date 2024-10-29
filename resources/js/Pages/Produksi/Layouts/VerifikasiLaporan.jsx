import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Label from "@/Components/Label";
import PrimaryButton from "@/Components/PrimaryButton";

const VerifikasiLaporan = ({ dataBahanBaku, id, userId }) => {
    const [jumlah, setJumlah] = useState("");
    const [selectedBahanBaku, setSelectedBahanBaku] = useState(null);
    const [filterIds, setFilterIds] = useState([]);
    const { data, setData, post } = useForm({ produksi: [] });

    const handleAddProduksi = () => {
        if (id && selectedBahanBaku && jumlah) {
            const jumlahInt = parseInt(jumlah);
            const remainingStock = calculateRemainingStock(selectedBahanBaku);

            if (jumlahInt > remainingStock) {
                alert(
                    "Jumlah yang dimasukkan melebihi sisa stok yang tersedia."
                );
                return;
            }

            const existingProduksi = data.produksi.find(
                (produksi) =>
                    produksi.bahan_baku_id === selectedBahanBaku.bahan_baku_id
            );
            if (existingProduksi) {
                alert("Bahan baku ini sudah ditambahkan.");
                return;
            }

            const newProduksi = {
                jumlah_bahan_baku: remainingStock,
                pemakaian_bahan_baku: remainingStock - jumlahInt,
                sisa_bahan_baku: jumlahInt,
                laporan_id: parseInt(id),
                bahan_baku_id: selectedBahanBaku.bahan_baku_id,
                user_id: parseInt(userId),
            };

            setData("produksi", [...data.produksi, newProduksi]);
            setFilterIds([...filterIds, selectedBahanBaku.bahan_baku_id]);
            setSelectedBahanBaku(null);
            setJumlah("");
        }
    };

    const handleRemoveProduksi = (index) => {
        const removedProduksi = data.produksi[index];
        const newProduksi = data.produksi.filter((_, i) => i !== index);
        setData("produksi", newProduksi);

        if (
            !newProduksi.some(
                (p) => p.bahan_baku_id === removedProduksi.bahan_baku_id
            )
        ) {
            setFilterIds(
                filterIds.filter((id) => id !== removedProduksi.bahan_baku_id)
            );
        }
    };

    const filterData = dataBahanBaku.filter(
        (bahanBaku) => !filterIds.includes(bahanBaku.bahan_baku_id)
    );

    const calculateTotalUsed = (bahanBaku) => {
        return data.produksi
            .filter(
                (produksi) => produksi.bahan_baku_id === bahanBaku.bahan_baku_id
            )
            .reduce((acc, produksi) => acc + produksi.pemakaian_bahan_baku, 0);
    };

    const calculateRemainingStock = (bahanBaku) => {
        const totalUsed = calculateTotalUsed(bahanBaku);
        return bahanBaku.jumlah_bahan_baku - totalUsed;
    };

    const handleSubmitAll = () => {
        if (data.produksi.length > 0) {
            post("/create-sisa-bahan-baku-produksi", {
                produksi: data.produksi,
            });
        }
    };

    return (
        <div className="w-full flex gap-5">
            <div className="w-96 h-screen overflow-auto">
                <input type="hidden" value={id} />
                <input type="hidden" value={userId} />
                <div className="flex flex-col gap-5 pb-32">
                    {filterData.map((bahanBaku) => (
                        <div
                            key={bahanBaku.bahan_baku_id}
                            className={`border p-5 cursor-pointer rounded-md shadow-lg relative ${
                                selectedBahanBaku?.bahan_baku_id ===
                                bahanBaku.bahan_baku_id
                                    ? "shadow-xl"
                                    : ""
                            }`}
                            onClick={() => setSelectedBahanBaku(bahanBaku)}
                        >
                            <h1 className="font-black border-b border-dashed pb-2">
                                {bahanBaku.bahan.id_bahan_baku}
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
                                        <p className="capitalize text-xs">
                                            {bahanBaku.bahan.nama_bahan_baku}
                                        </p>
                                        <p className="text-xs mt-2">
                                            QTY: <br />
                                            <span className="text-blue-500 font-bold">
                                                {bahanBaku.jumlah_bahan_baku}{" "}
                                                {
                                                    bahanBaku.bahan
                                                        .satuan_bahan_baku
                                                }
                                            </span>
                                        </p>
                                    </div>
                                    {selectedBahanBaku?.bahan_baku_id ===
                                        bahanBaku.bahan_baku_id && (
                                        <div className="">
                                            <input
                                                type="number"
                                                value={jumlah}
                                                className="w-[92px] rounded-md text-xs border"
                                                placeholder="Sisa stok"
                                                onChange={(e) =>
                                                    setJumlah(e.target.value)
                                                }
                                            />
                                            <div
                                                className="absolute z-20 top-2 right-2 cursor-pointer"
                                                onClick={handleAddProduksi}
                                            >
                                                <img
                                                    src="/assets/icons/plus.png"
                                                    alt=""
                                                    className="w-7 h-7 bg-green-300 p-2 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filterData.length === 0 && (
                        <div className="p-5 border rounded-lg">
                            <img
                                src="/assets/icons/check.png"
                                alt=""
                                className="w-10 h-10 mx-auto"
                            />
                            <p className="text-center mt-5 text-xs text-green-500">
                                Semua sisa bahan baku sudah dimasukan <br />
                                kirim semua data untuk melanjutkan
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full h-screen overflow-auto pb-32">
                <div className="relative grid grid-cols-3 gap-5 pb-32">
                    {data.produksi.map((produksi, index) => {
                        const bahanBaku = dataBahanBaku.find(
                            (b) => b.bahan_baku_id === produksi.bahan_baku_id
                        );
                        if (!bahanBaku) return null;

                        const totalUsed = calculateTotalUsed(bahanBaku);

                        return (
                            <div
                                key={index}
                                className="cursor-pointer p-5 shadow-lg rounded-md relative"
                            >
                                <h1 className="font-black border-b border-dashed pb-2">
                                    {bahanBaku.bahan.id_bahan_baku}
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
                                        {bahanBaku.bahan.nama_bahan_baku}
                                    </p>
                                    <div className="flex justify-between">
                                        <p className="text-xs mt-2">
                                            Jumlah bahan baku: <br />
                                            <span className="text-blue-500 font-bold">
                                                {bahanBaku.jumlah_bahan_baku}{" "}
                                                {
                                                    bahanBaku.bahan
                                                        .satuan_bahan_baku
                                                }
                                            </span>
                                        </p>
                                        <p className="text-xs mt-2">
                                            Penggunaan: <br />
                                            <span className="text-red-500 font-bold">
                                                {totalUsed}{" "}
                                                {
                                                    bahanBaku.bahan
                                                        .satuan_bahan_baku
                                                }
                                            </span>
                                        </p>
                                        <p className="text-xs mt-2">
                                            Sisa Stok: <br />
                                            <span className="text-green-500 font-bold">
                                                {calculateRemainingStock(
                                                    bahanBaku
                                                )}{" "}
                                                {
                                                    bahanBaku.bahan
                                                        .satuan_bahan_baku
                                                }
                                            </span>
                                        </p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <div
                                            className="bg-pink-400 p-2 rounded-md text-center cursor-pointer w-7"
                                            onClick={() =>
                                                handleRemoveProduksi(index)
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
                            </div>
                        );
                    })}
                </div>
                {data.produksi.length !== 0 &&
                    dataBahanBaku.length === data.produksi.length && (
                        <div className="fixed bottom-10 right-5">
                            <PrimaryButton onClick={handleSubmitAll}>
                                Kirim Semua Data
                            </PrimaryButton>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default VerifikasiLaporan;
