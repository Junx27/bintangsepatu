import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Table from "@/Layouts/Tabel";
import React, { useEffect, useState } from "react";

function LaporanStokBahanBaku() {
    const [dataBahanBaku, setDataBahanBaku] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataBahanBaku(response.data);
        };

        fetchData();
    }, []);
    return (
        <div className="pb-32">
            <Table
                header={[
                    "no",
                    "Id Bahan Baku",
                    "Nama Bahan Baku",
                    "Stok Bahan Baku",
                    "Stok Minimum",
                    "Satuan Bahan Baku",
                    "Harga Bahan Baku",
                    "Keterangan",
                ]}
            >
                {dataBahanBaku.map((item, index) => (
                    <tr
                        key={item.id}
                        className="hover:bg-blue-50 cursor-pointer"
                    >
                        <td className="border px-3 py-2">{index + 1}</td>
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
                        <td className="px-3 py-2 border">
                            <FormaterRupiah number={item.harga_bahan_baku} />
                        </td>
                        <td className="px-5 py-2 border">
                            {item.stok_bahan_baku > item.minimum_stok
                                ? "baik"
                                : item.stok_bahan_baku === item.minimum_stok
                                ? "cukup"
                                : "kurang"}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanStokBahanBaku;
