import React, { useEffect, useState } from "react";
import Label from "../../../Components/Label";
import PrimaryButton from "../../../Components/PrimaryButton";
import Empty from "../../../Components/Empty";
import { useForm } from "@inertiajs/react";

const BahanBaku = ({ dataBahanBaku, id, userId }) => {
    const [jumlah, setJumlah] = useState("");
    const [dataProduksiDetail, setDataProduksiDetail] = useState([]);
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
            const existingProduksi = data.produksi.find(
                (produksi) => produksi.bahan_baku_id === selectedBahanBaku.id
            );
            if (existingProduksi) {
                alert("Bahan baku ini sudah ditambahkan.");
                return;
            }

            const newProduksi = {
                stok_awal: remainingStock,
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

    useEffect(() => {
        const fetchDataPrduksiDetail = async () => {
            const response = await axios.get(
                `/api/bintangsepatu/produksi/${id}`
            );
            setDataProduksiDetail(response.data);
        };
        fetchDataPrduksiDetail();
    }, [id]);

    return (
        <div className="w-full flex gap-5 ml-8">
            <div className="w-96 border-r h-screen overflow-auto">
                <input type="hidden" value={id} />
                <input type="hidden" value={userId} />
                <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2 pt-5">
                    <Label className={"bg-green-500"} rotate={"rotate-90"} />
                    <h1 className="font-bold">Daftar bahan baku</h1>
                </div>
                <div className="flex flex-col gap-5 mr-5 pb-32">
                    {filterData.map((bahanBaku) => (
                        <div
                            key={bahanBaku.id}
                            className={`hover:border-pink-500 border border-dashed p-5 cursor-pointer rounded-md shadow-lg relative ${
                                selectedBahanBaku?.id === bahanBaku.id
                                    ? "border-pink-500 shadow-xl"
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
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="capitalize">
                                            {bahanBaku.nama_bahan_baku}
                                        </p>
                                        <p className="text-xs mt-2">
                                            Tersedia:{" "}
                                            <span className="text-blue-500 font-bold">
                                                {calculateRemainingStock(
                                                    bahanBaku
                                                )}{" "}
                                                {bahanBaku.satuan_bahan_baku}
                                            </span>
                                        </p>
                                    </div>
                                    {selectedBahanBaku?.id === bahanBaku.id && (
                                        <div className="">
                                            <input
                                                type="number"
                                                value={jumlah}
                                                className="w-[92px] rounded-md text-xs border-pink-500 border-dashed"
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
                </div>
            </div>
            <div className="w-full h-screen overflow-auto mr-10 pb-32">
                <div className="text-sm flex justify-between items-center mb-5 border-b border-dashed pb-2 pt-5">
                    <div className="flex gap-2 items-center ">
                        <Label className={"bg-red-500"} rotate={"rotate-90"} />
                        <h1 className="font-bold">
                            Daftar penggunaan bahan baku
                        </h1>
                    </div>
                    <div
                        className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                        onClick={() => window.location.reload()}
                    >
                        <img
                            src="/assets/icons/plus.png"
                            alt=""
                            className="w-3 h-3 rotate-45"
                        />
                    </div>
                </div>
                <div className="w-64 mx-auto">
                    <h1 className="font-black uppercase bg-pink-500/20 text-center p-2 border border-dashed border-pink-500 rounded-md">
                        {dataProduksiDetail.id_produksi}
                    </h1>
                </div>

                <div className="relative mt-10 grid grid-cols-3 gap-5 mr-5">
                    {data.produksi.map((produksi, index) => {
                        const bahanBaku = dataBahanBaku.find(
                            (b) => b.id === produksi.bahan_baku_id
                        );
                        if (!bahanBaku) return null;

                        const totalUsed = calculateTotalUsed(bahanBaku);

                        return (
                            <div
                                key={index}
                                className="hover:border-pink-500 border border-dashed cursor-pointer p-5 shadow-lg rounded-md relative"
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
                                    <div className="flex justify-between">
                                        <p className="text-xs mt-2">
                                            Stok Saat Ini: <br />
                                            <span className="text-blue-500 font-bold">
                                                {bahanBaku.stok_bahan_baku}{" "}
                                                {bahanBaku.satuan_bahan_baku}
                                            </span>
                                        </p>
                                        <p className="text-xs mt-2">
                                            Penggunaan: <br />
                                            <span className="text-red-500 font-bold">
                                                {totalUsed}{" "}
                                                {bahanBaku.satuan_bahan_baku}
                                            </span>
                                        </p>
                                        <p className="text-xs mt-2">
                                            Sisa Stok: <br />
                                            <span className="text-green-500 font-bold">
                                                {calculateRemainingStock(
                                                    bahanBaku
                                                )}{" "}
                                                {bahanBaku.satuan_bahan_baku}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <div
                                            className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
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

export default BahanBaku;
