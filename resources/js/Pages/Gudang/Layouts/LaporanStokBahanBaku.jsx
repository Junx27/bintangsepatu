import FormateDate from "@/Components/FormateDate";
import FormaterRupiah from "@/Layouts/FormaterRupiah";
import Table from "@/Layouts/Tabel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LaporanStokBahanBaku() {
    const tanggal = new Date();
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [statusFilter, setStatusFilter] = useState(""); // State for status filter
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/bintangsepatu/bahan-bakus");
            setDataBahanBaku(response.data);
        };

        fetchData();
    }, []);

    // Filter data based on status and search term
    const filteredData = dataBahanBaku.filter((item) => {
        const matchesStatus =
            !statusFilter ||
            (statusFilter === "baik" &&
                item.stok_bahan_baku > item.minimum_stok) ||
            (statusFilter === "cukup" &&
                item.stok_bahan_baku === item.minimum_stok) ||
            (statusFilter === "kurang" &&
                item.stok_bahan_baku < item.minimum_stok);
        const matchesSearchTerm = item.id_bahan_baku
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearchTerm;
    });

    const downloadPDF = () => {
        const doc = new jsPDF("portrait", "mm", "a4");
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("DATA TABEL STOK BAHAN BAKU", 105, 22, { align: "center" });
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
            { header: "ID Bahan Baku", dataKey: "id_bahan_baku" },
            { header: "Nama Bahan Baku", dataKey: "nama_bahan_baku" },
            { header: "Stok", dataKey: "stok_bahan_baku" },
            { header: "Stok Minimum", dataKey: "minimum_stok" },
            { header: "Satuan", dataKey: "satuan_bahan_baku" },
            { header: "Harga", dataKey: "harga_bahan_baku" },
            { header: "Keterangan", dataKey: "keterangan" },
        ];

        const data = filteredData.map((item, index) => ({
            no: index + 1,
            id_bahan_baku: item.id_bahan_baku,
            nama_bahan_baku: item.nama_bahan_baku,
            stok_bahan_baku: item.stok_bahan_baku,
            minimum_stok: item.minimum_stok,
            satuan_bahan_baku: item.satuan_bahan_baku,
            harga_bahan_baku: item.harga_bahan_baku,
            keterangan:
                item.stok_bahan_baku > item.minimum_stok
                    ? "baik"
                    : item.stok_bahan_baku === item.minimum_stok
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

        doc.save("Laporan_Stok_Bahan_Baku.pdf");
    };

    const downloadCSV = () => {
        const csvRows = [];
        const headers = [
            "No",
            "ID Bahan Baku",
            "Nama Bahan Baku",
            "Stok",
            "Stok Minimum",
            "Satuan",
            "Harga",
            "Keterangan",
        ];
        csvRows.push(headers.join(","));

        filteredData.forEach((item, index) => {
            const row = [
                index + 1,
                item.id_bahan_baku,
                item.nama_bahan_baku,
                item.stok_bahan_baku,
                item.minimum_stok,
                item.satuan_bahan_baku,
                item.harga_bahan_baku,
                item.stok_bahan_baku > item.minimum_stok
                    ? "baik"
                    : item.stok_bahan_baku === item.minimum_stok
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
        link.setAttribute("download", "Laporan_Stok_Bahan_Baku.csv");
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
                Data Tabel Stok Bahan Baku
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
                        placeholder="Cari berdasarkan ID Bahan Baku"
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
                    "ID Bahan Baku",
                    "Nama Bahan Baku",
                    "Stok Bahan Baku",
                    "Stok Minimum",
                    "Satuan",
                    "Harga",
                    "Keterangan",
                ]}
            >
                {filteredData.map((item, index) => (
                    <tr
                        key={item.id_bahan_baku}
                        className="hover:bg-blue-50 cursor-pointer"
                    >
                        <td className="border px-3 py-2 text-center">
                            {index + 1}
                        </td>
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
                                ? "Baik"
                                : item.stok_bahan_baku === item.minimum_stok
                                ? "Cukup"
                                : "Kurang"}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanStokBahanBaku;
