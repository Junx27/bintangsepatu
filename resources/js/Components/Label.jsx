import React from "react";

function Label({ className, rotate }) {
    return (
        <div className={`relative w-2 h-2 overflow-hidden + ${rotate}`}>
            <div
                className={`inset-0 w-full h-full rotate-45 absolute top-1 + ${className}`}
            ></div>
        </div>
    );
}

export default Label;
