import Navbar from "@/Layouts/Navbar";
import RoleAccess from "@/Middleware/RoleAcces";
import React, { useEffect, useState } from "react";
import { navbarProduksi } from "../Data/NavbarProduksi";
import Table from "@/Layouts/Tabel";
import axios from "axios";

function DaftarPesanan({ auth }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/pesanans");
            setData(response.data);
        };
        fetchData();
    }, []);
    return (
        <RoleAccess auth={auth} role={"produksi"}>
            <Navbar navbar={navbarProduksi} title={"Daftar Pesanan"}>
                <div className="ml-12 mt-3">
                    <Table
                        header={[
                            "Id Pesanan",
                            "Nama Pemesan",
                            "Id Produk",
                            "Nama Produk",
                            "QTY",
                            "Harga Produk",
                            "Total Pesanan",
                        ]}
                    >
                        {data.map((i) => (
                            <tr
                                key={i.id}
                                className="hover:bg-blue-50 cursor-pointer"
                            >
                                <td className="px-3 py-2 border">
                                    {i.id_pesanan}
                                </td>
                                <td className="px-3 py-2 border">
                                    {i.nama_pemesan}
                                </td>
                                <td className="px-3 py-2 border">
                                    {i.produk.id_produk}
                                </td>
                                <td className="px-3 py-2 border">
                                    {i.produk.nama_produk}
                                </td>
                                <td className="px-3 py-2 border text-center">
                                    {i.jumlah_pesanan}
                                </td>
                                <td className="px-3 py-2 border text-end">
                                    {i.produk.harga_produk}
                                </td>
                                <td className="px-3 py-2 border text-end">
                                    {i.produk.harga_produk * i.jumlah_pesanan}
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </Navbar>
        </RoleAccess>
    );
}

export default DaftarPesanan;
