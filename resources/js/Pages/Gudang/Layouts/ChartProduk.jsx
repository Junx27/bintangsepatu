import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";
import FormateDate from "@/Components/FormateDate";

Chart.register(...registerables);

function ChartProduk({ analisis }) {
    const tanggal = new Date();
    const chartRef = useRef(null);

    const idProduk = _.groupBy(analisis, "id_produk");
    const stokTertinggi = _.maxBy(analisis, "stok_produk");
    const stokTerendah = _.minBy(analisis, "stok_produk");
    const jumlahStokProduk = analisis.reduce(
        (total, item) => total + item.stok_produk,
        0
    );
    const labels = Object.keys(idProduk).map((id) => {
        const product = idProduk[id][0];
        return `${id} - ${product.nama_produk}`;
    });
    const labelsValue = Object.values(idProduk).map((group) =>
        group.reduce((total, item) => total + item.stok_produk, 0)
    );

    const backgroundColors = [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
    ];

    const borderColors = [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
    ];

    const loopedBackgroundColors = [];
    const loopedBorderColors = [];
    for (let i = 0; i < labels.length; i++) {
        const index = i % backgroundColors.length;
        loopedBackgroundColors.push(backgroundColors[index]);
        loopedBorderColors.push(borderColors[index]);
    }

    useEffect(() => {
        if (chartRef.current && labels.length > 0 && labelsValue.length > 0) {
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: "Stok Produk",
                        data: labelsValue,
                        backgroundColor: loopedBackgroundColors,
                        borderColor: loopedBorderColors,
                        borderWidth: 1,
                    },
                ],
            };

            const chartInstance = new Chart(chartRef.current, {
                type: "bar",
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            return () => {
                chartInstance.destroy();
            };
        }
    }, [
        analisis,
        labels,
        labelsValue,
        loopedBackgroundColors,
        loopedBorderColors,
    ]);

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
                        Belum ada data stok produk
                    </h1>
                </div>
            ) : (
                <div className="flex justify-between gap-10 items-center">
                    <div className="w-full">
                        <h1 className="font-black text-xl uppercase text-center">
                            data grafik stok produk
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
                                <h1>Jumlah Produk:</h1>
                                <p className="text-blue-500 text-2xl">
                                    {analisis.length}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Stok Produk Tertinggi:</h1>
                                <p className="text-green-500 text-2xl">
                                    {stokTertinggi.stok_produk}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Stok Produk Terendah:</h1>
                                <p className="text-red-500 text-2xl">
                                    {stokTerendah.stok_produk}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-center gap-2 p-5 font-black w-full border">
                                <h1>Total Stok Produk:</h1>
                                <p className="text-purple-500 text-2xl">
                                    {jumlahStokProduk}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChartProduk;
