import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import _ from "lodash";

Chart.register(...registerables);

function ChartBahanBaku({ analisis }) {
    const chartRef = useRef(null);

    const idBahanBaku = _.groupBy(analisis, "id_bahan_baku");
    const labels = Object.keys(idBahanBaku).map((id) => {
        const bahanBaku = idBahanBaku[id][0];
        return `${id} - ${bahanBaku.nama_bahan_baku}`;
    });
    const labelsValue = Object.values(idBahanBaku).map((group) =>
        group.reduce((total, item) => total + item.stok_bahan_baku, 0)
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
    }, [analisis, labels, labelsValue]);

    return (
        <div>
            <canvas ref={chartRef} />
        </div>
    );
}

export default ChartBahanBaku;