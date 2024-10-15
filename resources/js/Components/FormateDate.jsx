import React from "react";

const FormateDate = ({ data }) => {
    const date = new Date(data);

    if (isNaN(date.getTime())) {
        console.error("Invalid date provided:", data);
        return <span>Tanggal tidak valid</span>; // Default message for invalid date
    }

    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return <span>{formattedDate}</span>;
};

export default FormateDate;
