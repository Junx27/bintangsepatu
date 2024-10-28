import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Table from "@/Layouts/Tabel";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LaporanStokProduk() {
    const [dataProduk, setDataProduk] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataProduk(response.data);
        };
        fetchData();
    }, []);
    return (
        <div className="pb-32">
            <Table
                header={[
                    "no",
                    "Id Produk",
                    "Nama Produk",
                    "Harga Produk",
                    "Stok Produk",
                    "Stok Minimum",
                    "Keterangan",
                ]}
            >
                {dataProduk.map((item, index) => (
                    <tr
                        key={item.id}
                        className="hover:bg-blue-50 cursor-pointer"
                    >
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="px-5 py-2 border font-bold uppercase">
                            {item.id_produk}
                        </td>
                        <td className="px-5 py-2 border w-64 capitalize">
                            {item.nama_produk}
                        </td>
                        <td className="px-5 py-2 border">
                            <FormaterRupiah number={item.harga_produk} />
                        </td>
                        <td className="px-5 py-2 border">{item.stok_produk}</td>
                        <td className="px-3 py-2 border">
                            {item.stok_minimum_produk}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.stok_produk > item.stok_minimum_produk
                                ? "baik"
                                : item.stok_produk === item.stok_minimum_produk
                                ? "cukup"
                                : "kurang"}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanStokProduk;
