import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";

Chart.register(...registerables);

function ChartProdukMasuk({ analisis }) {
    const chartRef = useRef(null);

    const tanggalSelesai = _.groupBy(analisis, "id_laporan");
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
            <h1 className="font-black text-2xl uppercase text-center mb-10">
                data grafik produk masuk
            </h1>
            <canvas ref={chartRef} />
        </div>
    );
}

export default ChartProdukMasuk;
