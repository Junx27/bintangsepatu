import FormateDate from "@/Components/FormateDate";
import Table from "@/Layouts/Tabel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function LaporanRepairProduk() {
    const [dataRepair, setDataRepair] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const tanggal = new Date();

    useEffect(() => {
        const fetchDataRepair = async () => {
            try {
                const response = await axios.get(
                    "/api/bintangsepatu/data-produk-masuk-gudang"
                );
                setDataRepair(response.data);
            } catch (error) {
                console.error("Error fetching data repair:", error);
            }
        };

        fetchDataRepair();
    }, []);

    const filterDataRepair = dataRepair.filter(
        (item) =>
            item.jumlah_produk_ditolak !== 0 &&
            item.status_penerimaan_produk === "diverifikasi repair"
    );

    const filteredData = filterDataRepair.filter((item) => {
        const createdAt = new Date(item.tanggal_penerimaan_produk);
        const matchesDateRange =
            (!startDate || createdAt >= new Date(startDate)) &&
            (!endDate ||
                createdAt <= new Date(new Date(endDate).setHours(23, 59, 59)));
        const matchesSearchTerm = item.produk.nama_produk
            .toString()
            .includes(searchTerm.toLowerCase());

        return matchesDateRange && matchesSearchTerm;
    });

    const downloadPDF = () => {
        const doc = new jsPDF("portrait", "mm", "a4");
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Laporan Repair Produk", 105, 22, { align: "center" });
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
            { header: "ID Produksi Masuk", dataKey: "id_produksi_masuk" },
            { header: "ID Produk", dataKey: "id_produk" },
            { header: "Nama Produk", dataKey: "nama_produk" },
            { header: "Jumlah", dataKey: "jumlah" },
            { header: "Tanggal Pengiriman", dataKey: "tanggal_pengiriman" },
            { header: "Tanggal Penerimaan", dataKey: "tanggal_penerimaan" },
            { header: "Diterima (Qty)", dataKey: "diterima_qty" },
            { header: "Ditolak (Qty)", dataKey: "ditolak_qty" },
        ];

        const data = filteredData.map((item, index) => ({
            no: index + 1,
            id_produksi_masuk: item.id_produksi_masuk,
            id_produk: item.id_produk,
            nama_produk: item.produk.nama_produk,
            jumlah: item.jumlah_produksi,
            tanggal_pengiriman: new Date(
                item.tanggal_pengiriman_produk
            ).toLocaleDateString("id-ID"),
            tanggal_penerimaan: item.tanggal_penerimaan_produk
                ? new Date(item.tanggal_penerimaan_produk).toLocaleDateString(
                      "id-ID"
                  )
                : "-",
            diterima_qty: item.jumlah_produk_diterima,
            ditolak_qty: item.jumlah_produk_ditolak,
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
            bodyStyles: { lineWidth: 0.1, fillColor: [255, 255, 255] },
            theme: "grid",
        });

        doc.save("Laporan_Repair_Produk.pdf");
    };

    const downloadCSV = () => {
        const csvRows = [];
        const headers = [
            "No",
            "ID Produksi Masuk",
            "ID Produk",
            "Nama Produk",
            "Jumlah",
            "Tanggal Pengiriman",
            "Tanggal Penerimaan",
            "Diterima (Qty)",
            "Ditolak (Qty)",
        ];
        csvRows.push(headers.join(","));

        filteredData.forEach((item, index) => {
            const row = [
                index + 1,
                item.id_produksi_masuk,
                item.id_produk,
                item.produk.nama_produk,
                item.jumlah_produksi,
                new Date(item.tanggal_pengiriman_produk).toLocaleDateString(
                    "id-ID"
                ),
                item.tanggal_penerimaan_produk
                    ? new Date(
                          item.tanggal_penerimaan_produk
                      ).toLocaleDateString("id-ID")
                    : "-",
                item.jumlah_produk_diterima,
                item.jumlah_produk_ditolak,
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Laporan_Repair_Produk.csv");
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
        <div>
            <h1 className="font-black text-xl uppercase text-center">
                Data Tabel Repair Produk
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
                        placeholder="Cari berdasarkan nama produk"
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
                            alt="PDF Icon"
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
                            alt="CSV Icon"
                            className="w-5 h-5"
                        />
                        <p>Unduh CSV</p>
                    </div>
                </div>
            </div>
            <Table
                header={[
                    "No",
                    "ID Produksi Masuk",
                    "ID Produk",
                    "Nama Produk",
                    "Jumlah",
                    "Tanggal Pengiriman",
                    "Tanggal Penerimaan",
                    "Diterima (Qty)",
                    "Ditolak (Qty)",
                ]}
            >
                {filteredData.map((item, index) => (
                    <tr key={item.id}>
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">
                            {item.id_produksi_masuk}
                        </td>
                        <td className="border px-3 py-2">{item.id_produk}</td>
                        <td className="border px-3 py-2">
                            {item.produk.nama_produk}
                        </td>
                        <td className="border px-3 py-2">
                            {item.jumlah_produksi}
                        </td>
                        <td className="border px-3 py-2">
                            <FormateDate
                                data={item.tanggal_pengiriman_produk}
                            />
                        </td>
                        <td className="border px-3 py-2">
                            {item.tanggal_penerimaan_produk ? (
                                <FormateDate
                                    data={item.tanggal_penerimaan_produk}
                                />
                            ) : (
                                "-"
                            )}
                        </td>
                        <td className="border px-3 py-2">
                            {item.jumlah_produk_diterima}
                        </td>
                        <td className="border px-3 py-2">
                            {item.jumlah_produk_ditolak || "-"}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}

export default LaporanRepairProduk;
