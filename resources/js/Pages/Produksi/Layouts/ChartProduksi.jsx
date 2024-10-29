import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";
import FormateDate from "@/Components/FormateDate";

Chart.register(...registerables);

function ChartProduksi({ analisis }) {
    const tanggal = new Date();
    const chartRef = useRef(null);
    const tanggalSelesai = _.groupBy(analisis, "tanggal_selesai");
    const pengirimanTertinggi = _.maxBy(analisis, "jumlah_produksi");
    const pengirimanTerendah = _.minBy(analisis, "jumlah_produksi");
    const jumlahPengirimanProduk = analisis.reduce(
        (total, item) => total + item.jumlah_produksi,
        0
    );
    const labels = Object.keys(tanggalSelesai);
    const labelsValue = Object.values(tanggalSelesai).map((group) =>
        group.reduce((total, item) => total + item.jumlah_produksi, 0)
    );

    useEffect(() => {
        if (chartRef.current && labels.length > 0 && labelsValue.length > 0) {
            new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Data Produksi selesai",
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
                <div className="mt-20">
                    <img
                        src="/assets/icons/no-document.png"
                        alt=""
                        className="w-10 h-10 mx-auto"
                    />
                    <h1 className="text-xs text-red-500 text-center mt-5">
                        Belum ada data produksi terkirim
                    </h1>
                </div>
            ) : (
                <div className="flex justify-between gap-10">
                    <div className="w-full">
                        <h1 className="font-black text-xl uppercase text-center">
                            data grafik produksi selesai
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
                        <div className="w-56">
                            <div className="flex flex-col items-center gap-2 bg-blue-500/20 p-5 rounded-md font-black w-full">
                                <h1>Produksi Terkirim:</h1>
                                <p className="text-blue-500 text-2xl">
                                    {analisis.length}
                                </p>
                            </div>
                        </div>
                        <div className="w-56">
                            <div className="flex flex-col items-center gap-2 bg-green-500/20 p-5 rounded-md font-black w-full">
                                <h1>Produksi Tertinggi:</h1>
                                <p className="text-green-500 text-2xl">
                                    {pengirimanTertinggi.jumlah_produksi}
                                </p>
                            </div>
                        </div>
                        <div className="w-56">
                            <div className="flex flex-col items-center gap-2 bg-red-500/20 p-5 rounded-md font-black w-full">
                                <h1>Produksi Terendah:</h1>
                                <p className="text-red-500 text-2xl">
                                    {pengirimanTerendah.jumlah_produksi}
                                </p>
                            </div>
                        </div>
                        <div className="w-56">
                            <div className="flex flex-col items-center gap-2 bg-purple-500/20 p-5 rounded-md font-black w-full">
                                <h1>Total Produksi Terkirim:</h1>
                                <p className="text-purple-500 text-2xl">
                                    {jumlahPengirimanProduk}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChartProduksi;
