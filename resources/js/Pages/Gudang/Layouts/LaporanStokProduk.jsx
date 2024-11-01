import FormateDate from "@/Components/FormateDate";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Table from "@/Layouts/Tabel";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";

function LaporanStokProduk() {
    const tanggal = new Date();
    const [dataProduk, setDataProduk] = useState([]);
    const [statusFilter, setStatusFilter] = useState(""); // Updated state for status filter
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/produks");
            setDataProduk(response.data);
        };
        fetchData();
    }, []);

    // Filter data based on search term and product status
    const filteredData = dataProduk.filter((item) => {
        const matchesStatus =
            !statusFilter ||
            (statusFilter === "baik" &&
                item.stok_produk > item.stok_minimum_produk) ||
            (statusFilter === "cukup" &&
                item.stok_produk === item.stok_minimum_produk) ||
            (statusFilter === "kurang" &&
                item.stok_produk < item.stok_minimum_produk);
        const matchesSearchTerm = item.id_produk
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearchTerm;
    });

    const downloadPDF = () => {
        const doc = new jsPDF("portrait", "mm", "a4");
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("DATA TABEL STOK PRODUK", 105, 22, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Sistem Informasi Inventori dan Produksi (SIIP)", 105, 30, {
            align: "center",
        });
        doc.setFontSize(10);
        doc.text(
            `Tanggal: ${tanggal.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })}`,
            105,
            38,
            {
                align: "center",
            }
        );
        doc.line(14, 42, 196, 42);

        const columns = [
            { header: "No", dataKey: "no" },
            { header: "ID", dataKey: "id_produk" },
            { header: "Nama", dataKey: "nama_produk" },
            { header: "Harga", dataKey: "harga_produk" },
            { header: "Stok", dataKey: "stok_produk" },
            { header: "Stok Minimum", dataKey: "stok_minimum_produk" },
            { header: "Keterangan", dataKey: "keterangan" },
        ];

        const data = filteredData.map((item, index) => ({
            no: index + 1,
            id_produk: item.id_produk,
            nama_produk: item.nama_produk,
            harga_produk: item.harga_produk,
            stok_produk: item.stok_produk,
            stok_minimum_produk: item.stok_minimum_produk,
            keterangan:
                item.stok_produk > item.stok_minimum_produk
                    ? "baik"
                    : item.stok_produk === item.stok_minimum_produk
                    ? "cukup"
                    : "kurang",
        }));

        doc.autoTable(columns, data, {
            startY: 52,
            styles: {
                lineWidth: 0.1,
                halign: "center",
                valign: "middle",
                fontSize: 12,
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            bodyStyles: { lineWidth: 0.1, fillColor: [255, 255, 255] },
            theme: "grid",
        });

        doc.save("Laporan_Stok_Produk.pdf");
    };

    const downloadCSV = () => {
        const csvRows = [];
        const headers = [
            "No",
            "ID Produk",
            "Nama Produk",
            "Harga Produk",
            "Stok Produk",
            "Stok Minimum",
            "Keterangan",
        ];
        csvRows.push(headers.join(","));

        filteredData.forEach((item, index) => {
            const row = [
                index + 1,
                item.id_produk,
                item.nama_produk,
                item.harga_produk,
                item.stok_produk,
                item.stok_minimum_produk,
                item.stok_produk > item.stok_minimum_produk
                    ? "baik"
                    : item.stok_produk === item.stok_minimum_produk
                    ? "cukup"
                    : "kurang",
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Laporan_Stok_Produk.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetFilters = () => {
        setStatusFilter("");
        setSearchTerm("");
    };

    return (
        <div className="pb-32">
            <h1 className="font-black text-xl uppercase text-center">
                Data Tabel Semua Stok Produk
            </h1>
            <h2 className="text-center font-bold text-sm">
                Sistem Informasi Inventori dan Produksi (SIIP)
            </h2>
            <p className="text-center text-xs mb-5 border-b-4 border-double border-black pb-2">
                Tanggal: <FormateDate data={tanggal} />
            </p>
            <div className="flex justify-between gap-10 items-center mb-5">
                <div className="flex w-full gap-5">
                    <div
                        className="flex gap-2 items-center bg-black p-1 px-5 rounded-md text-white text-[10px]"
                        onClick={resetFilters}
                    >
                        <p>Reset All</p>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-md px-2 py-1 text-[10px] w-20"
                    >
                        <option value="">Status</option>
                        <option value="baik">Baik</option>
                        <option value="cukup">Cukup</option>
                        <option value="kurang">Kurang</option>
                    </select>
                </div>
                <div className="w-full flex justify-center">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan ID Produk"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md px-2 py-1 w-full text-[10px]"
                    />
                </div>
                <div className="flex justify-end w-full gap-5 text-[10px]">
                    <div
                        className="flex gap-2 items-center bg-red-400 p-2 rounded-md text-white"
                        onClick={downloadPDF}
                    >
                        <img
                            src="assets/icons/pdf.png"
                            alt=""
                            className="w-5 h-5"
                        />
                        <p>Unduh PDF</p>
                    </div>
                    <div
                        className="flex gap-2 items-center bg-green-400 p-2 rounded-md text-white"
                        onClick={downloadCSV}
                    >
                        <img
                            src="assets/icons/sheets.png"
                            alt=""
                            className="w-5 h-5"
                        />
                        <p>Unduh CSV</p>
                    </div>
                </div>
            </div>
            <Table
                header={[
                    "No",
                    "ID Produk",
                    "Nama Produk",
                    "Harga Produk",
                    "Stok Produk",
                    "Stok Minimum",
                    "Keterangan",
                ]}
            >
                {filteredData.map((item, index) => (
                    <tr
                        key={item.id_produk}
                        className="hover:bg-blue-50 cursor-pointer"
                    >
                        <td className="border px-3 py-2 text-center">
                            {index + 1}
                        </td>
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
