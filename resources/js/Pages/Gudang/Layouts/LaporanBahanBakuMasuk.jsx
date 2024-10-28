import FormateDate from "@/Components/FormateDate";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Table from "@/Layouts/Tabel";
import React, { useEffect, useState } from "react";

function LaporanBahanBakuMasuk() {
    const tanggal = new Date();
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/api/bintangsepatu/data-bahan-baku-masuk-gudang"
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
            <Table
                header={[
                    "No",
                    "Id Bahan Baku",
                    "Nama Bahan Baku",
                    "Tanggal Masuk",
                    "Jumlah bahan baku",
                    "Satuan Bahan Baku",
                    "Harga Bahan Baku",
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
                            {item.bahan.nama_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.tanggal_masuk}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.jumlah_bahan_baku_masuk}
                        </td>
                        <td className="px-3 py-2 border">
                            {item.bahan.satuan_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            <FormaterRupiah
                                number={item.bahan.harga_bahan_baku}
                            />
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanBahanBakuMasuk;
