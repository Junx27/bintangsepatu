import FormateDate from "@/Components/FormateDate";
import Table from "@/Layouts/Tabel";
import React, { useEffect, useState } from "react";

function LaporanBahanBaku() {
    const tanggal = new Date();
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
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
        fetchData();
    }, []);
    return (
        <div className="">
            <div className="relative mb-10 border-b-4 border-black border-double pb-3">
                <div className="absolute top-2">
                    <img src="/assets/logo.png" alt="" className="w-8 h-8" />
                </div>
                <h1 className="font-black uppercase text-center text-xl">
                    laporan bagian gudang
                </h1>
                <h2 className="text-center font-bold text-sm">
                    Sistem Informasi Inventori dan Produksi (SIIP)
                </h2>
                <h2 className="text-center font-bold text-sm">
                    NOMOR: LAG-001/01/LAP-001/LAP-014
                </h2>
                <p className="absolute top-2 right-5 text-xs">
                    <FormateDate data={tanggal} />
                </p>
            </div>
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
                {dataBahanBaku.map((item) => (
                    <tr
                        key={item.id}
                        className="hover:bg-blue-50 cursor-pointer"
                    >
                        <td className="px-5 py-2 border font-bold uppercase">
                            {item.id_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border w-64 capitalize">
                            {item.nama_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.stok_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.minimum_stok}
                        </td>
                        <td className="px-3 py-2 border">
                            {item.satuan_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.harga_bahan_baku}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanBahanBaku;
