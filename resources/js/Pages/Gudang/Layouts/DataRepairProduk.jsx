import FormateDate from "@/Components/FormateDate";
import Table from "@/Layouts/Tabel";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function DataRepairProduk() {
    const [dataRepair, setDataRepair] = useState([]);
    const [id, setId] = useState(null);
    const { data, setData, post } = useForm({
        jumlah_produk_repair: "",
        produk_id: "",
        user_id: "",
        id: "",
    });

    useEffect(() => {
        const fetchDataRepair = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataRepair(response.data);
        };
        if (id !== null) {
            const fetchDataRepairDetail = async () => {
                const response = await axios.get(
                    `/api/bintangsepatu/data-produk-masuk-gudang/${id}`
                );
                setData({
                    jumlah_produk_repair: response.data.jumlah_produk_ditolak,
                    produk_id: response.data.produk_id,
                    user_id: response.data.user_id,
                    id: response.data.id,
                });
            };
            fetchDataRepairDetail();
        }

        fetchDataRepair();
    }, [id]);

    const filterDataRepair = dataRepair.filter(
        (item) =>
            item.jumlah_produk_ditolak !== 0 &&
            item.status_penerimaan_produk !== "diverifikasi repair"
    );

    const handleCreateRepair = (e) => {
        e.preventDefault();
        post("/repair-produk");
    };

    return (
        <div>
            {filterDataRepair.length === 0 ? (
                <div className="mt-20">
                    <img
                        src="/assets/icons/no-document.png"
                        alt=""
                        className="w-10 h-10 mx-auto"
                    />
                    <h1 className="text-xs text-red-500 text-center mt-5">
                        Belum ada data produk dikembalikan
                    </h1>
                </div>
            ) : (
                <Table
                    header={[
                        "no",
                        "id produksi masuk",
                        "id produk",
                        "nama produk",
                        "jumlah",
                        "tanggal pengiriman",
                        "tanggal penerimaan",
                        "diterima (qty)",
                        "ditolak (qty)",
                    ]}
                >
                    {filterDataRepair.map((i, index) => (
                        <tr key={i.id}>
                            <td className="border px-3 py-2">{index + 1}</td>
                            <td className="border px-3 py-2">
                                {i.id_produksi_masuk}
                            </td>
                            <td className="border px-3 py-2">{i.id_produk}</td>
                            <td className="border px-3 py-2">
                                {i.produk.nama_produk}
                            </td>
                            <td className="border px-3 py-2">
                                {i.jumlah_produksi}
                            </td>
                            <td className="border px-3 py-2">
                                <FormateDate
                                    data={i.tanggal_pengiriman_produk}
                                />
                            </td>
                            <td className="border px-3 py-2">
                                {i.tanggal_penerimaan_produk ? (
                                    <FormateDate
                                        data={i.tanggal_penerimaan_produk}
                                    />
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td className="border px-3 py-2">
                                {i.jumlah_produk_diterima}
                            </td>
                            <td className="border px-3 py-2">
                                <div className="flex justify-between items-center">
                                    <p>{i.jumlah_produk_ditolak || "-"}</p>
                                    <div onMouseOver={(e) => setId(i.id)}>
                                        <form onSubmit={handleCreateRepair}>
                                            <button className="bg-red-500 text-white p-1 px-2 rounded-md">
                                                Repair
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
}

export default DataRepairProduk;
