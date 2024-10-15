import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";

Chart.register(...registerables);

function ChartProduksi({ analisis }) {
    const chartRef = useRef(null);

    const tanggalSelesai = _.groupBy(analisis, "tanggal_selesai");
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
            <canvas ref={chartRef} />
        </div>
    );
}

export default ChartProduksi;
