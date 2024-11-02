import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";
import FormateDate from "@/Components/FormateDate";

Chart.register(...registerables);

function ChartProdukMasuk({ analisis }) {
    const tanggal = new Date();
    const chartRef = useRef(null);

    const tanggalSelesai = _.groupBy(analisis, "id_laporan");
    const penerimaanTertinggi = _.maxBy(analisis, "jumlah_produk_diterima");
    const penerimaanTerendah = _.minBy(analisis, "jumlah_produk_diterima");
    const jumlahPenerimaanProduk = analisis.reduce(
        (total, item) => total + item.jumlah_produk_diterima,
        0
    );
    const labels = Object.keys(tanggalSelesai);
    const labelsValue = Object.values(tanggalSelesai).map((group) =>
        group.reduce((total, item) => total + item.jumlah_produk_diterima, 0)
    );

    useEffect(() => {
        if (chartRef.current && labels.length > 0 && labelsValue.length > 0) {
            new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Data Produk Masuk",
                            data: labelsValue,
                            fill: false,
                            borderColor: "#D91656",
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return ` ${tooltipItem.raw} pcs`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [analisis]);

    return (
        <div>
            {analisis.length === 0 ? (
                <div className=""></div>
            ) : (
                <div className="flex justify-between gap-10 items-center">
                    <div className="w-full">
                        <h1 className="font-black text-xl uppercase text-center">
                            data grafik produk masuk
                        </h1>
                        <h2 className="text-center font-bold text-sm">
                            Sistem Informasi Inventori dan Produksi (SIIP)
                        </h2>
                        <p className="text-center text-xs mb-5 border-b-4 border-double border-black pb-2">
                            Tanggal: <FormateDate data={tanggal} />
                        </p>
                        <canvas ref={chartRef} />
                    </div>
                    <div className="text-sm w-96 flex flex-col gap-10 mr-10">
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Produk Masuk:</h1>
                                <p className="text-green-500 text-2xl">
                                    {analisis.length}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Produk Masuk Tertinggi:</h1>
                                <p className="text-green-500 text-2xl">
                                    {penerimaanTertinggi.jumlah_produk_diterima}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Produk Masuk Terendah:</h1>
                                <p className="text-red-500 text-2xl">
                                    {penerimaanTerendah.jumlah_produk_diterima}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Total Produk Masuk:</h1>
                                <p className="text-purple-500 text-2xl">
                                    {jumlahPenerimaanProduk}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChartProdukMasuk;
