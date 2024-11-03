import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import jsPDF from "jspdf";
import "jspdf-autotable";
import FormateDate from "@/Components/FormateDate";
import Table from "@/Layouts/Tabel";

function LaporanSisaBahanBaku() {
    const tanggal = new Date();
    const [dataBahanBaku, setDataBahanBaku] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/api/bintangsepatu/data-laporan-produksis"
                );
                setDataBahanBaku(response.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    const sisaBahanBaku = dataBahanBaku.filter(
        (item) => item.sisa_bahan_baku !== 0
    );

    const filteredData = sisaBahanBaku.filter((item) => {
        const createdAt = new Date(item.created_at);
        const matchesDateRange =
            (!startDate || createdAt >= new Date(startDate)) &&
            (!endDate ||
                createdAt <= new Date(new Date(endDate).setHours(23, 59, 59)));
        const matchesSearchTerm = item.bahan.id_bahan_baku
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesDateRange && matchesSearchTerm;
    });

    const downloadPDF = () => {
        const doc = new jsPDF("portrait", "mm", "a4");
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("DATA TABEL SISA BAHAN BAKU PRODUKSI", 105, 22, {
            align: "center",
        });
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
            { align: "center" }
        );
        doc.line(14, 42, 196, 42);
        const columns = [
            { header: "No", dataKey: "no" },
            { header: "ID", dataKey: "id" },
            { header: "Nama", dataKey: "nama" },
            { header: "Tanggal", dataKey: "tanggal" },
            { header: "Jumlah", dataKey: "jumlah" },
            { header: "Pemakaian", dataKey: "pemakaian" },
            { header: "Sisa", dataKey: "sisa" },
        ];
        const data = filteredData.map((item, index) => ({
            no: index + 1,
            id: item.id_bahan_baku,
            nama: item.bahan.nama_bahan_baku,
            tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
            jumlah: item.jumlah_bahan_baku,
            pemakaian: item.pemakaian_bahan_baku,
            sisa: item.sisa_bahan_baku,
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
                lineWidth: 0.1,
                fontStyle: "bold",
            },
            bodyStyles: {
                lineWidth: 0.1,
                fillColor: [255, 255, 255],
            },
            columnStyles: {
                id: { cellWidth: "auto" },
                nama: { cellWidth: 40, halign: "left" },
                tanggal: { cellWidth: 50, halign: "left" },
                jumlah: { cellWidth: "auto" },
                pemakaian: { cellWidth: "auto" },
                sisa: { cellWidth: "auto" },
            },
            theme: "grid",
        });

        doc.save("Laporan_Sisa_Bahan_Baku.pdf");
    };

    const downloadCSV = () => {
        const csvRows = [];
        const headers = [
            "No",
            "Id Bahan Baku",
            "Nama Bahan Baku",
            "Tanggal",
            "Jumlah Bahan Baku",
            "Pemakaian Bahan Baku",
            "Sisa Bahan Baku",
        ];
        csvRows.push(headers.join(","));

        filteredData.forEach((item, index) => {
            const row = [
                index + 1,
                item.bahan.id_bahan_baku,
                item.bahan.nama_bahan_baku,
                new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                item.jumlah_bahan_baku,
                item.pemakaian_bahan_baku,
                item.sisa_bahan_baku,
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Laporan_Sisa_Bahan_Baku.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchTerm("");
    };

    return (
        <div className="pb-32">
            <h1 className="font-black text-xl uppercase text-center">
                Data Tabel Sisa Bahan Baku Produksi
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

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-[10px]"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-[10px]"
                    />
                </div>
                <div className="w-full flex justify-center">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan id bahan baku"
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
                    "Id Bahan Baku",
                    "Nama Bahan Baku",
                    "Tanggal",
                    "Jumlah Bahan Baku",
                    "Pemakaian Bahan Baku",
                    "Sisa Bahan Baku",
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
                            {item.bahan.id_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border w-64 capitalize">
                            {item.bahan.nama_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.jumlah_bahan_baku}
                        </td>
                        <td className="px-3 py-2 border">
                            {item.pemakaian_bahan_baku}
                        </td>
                        <td className="px-5 py-2 border">
                            {item.sisa_bahan_baku}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanSisaBahanBaku;
