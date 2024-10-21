import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";

Chart.register(...registerables);

function ChartBahanBakuMasuk({ analisis }) {
    const chartRef = useRef(null);

    const tanggalSelesai = _.groupBy(analisis, "id");
    const labels = Object.keys(tanggalSelesai).map((id) => {
        const bahanBaku = tanggalSelesai[id][0];
        return `${bahanBaku.id_bahan_baku}`;
    });
    const labelsValue = Object.values(tanggalSelesai).map((group) =>
        group.reduce((total, item) => total + item.jumlah_bahan_baku_masuk, 0)
    );

    useEffect(() => {
        if (chartRef.current && labels.length > 0 && labelsValue.length > 0) {
            new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Data Bahan Baku Masuk",
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

export default ChartBahanBakuMasuk;
