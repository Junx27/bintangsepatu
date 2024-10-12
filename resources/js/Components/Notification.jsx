import React from "react";

function Notification({ parameter, nama, data }) {
    return (
        parameter === nama && (
            <span
                className={`w-2 h-2 bg-red-500 rounded-full absolute right-1 top-1 animate-pulse ${
                    data.length ? "block" : "hidden"
                }`}
            ></span>
        )
    );
}

export default Notification;
