import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    jumlahData,
    keterangan,
}) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (newPage) => {
        onPageChange(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <nav className="mt-5 py-1 flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-col items-center justify-center sm:justify-start">
                <p className="text-xs text-gray-700">
                    Halaman
                    <span className="font-bold text-blue-500">
                        {" "}
                        {currentPage}{" "}
                    </span>
                    dari
                    <span className="font-bold text-blue-500">
                        {" "}
                        {totalPages}{" "}
                    </span>
                    Halaman
                </p>
                <p className="mt-2 text-[10px] text-blue-500 font-semibold bg-blue-500/20 p-1 rounded-md px-3">
                    Total {jumlahData} data {keterangan}
                </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end mt-2 sm:mt-0">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`ml-2 relative inline-flex items-center p-2 text-xs font-medium rounded-md hover:bg-yellow-300 cursor-pointer ${
                        currentPage === 1 ? "hidden" : ""
                    }`}
                >
                    <img
                        src="/assets/icons/next-button.png"
                        alt=""
                        className="w-3 h-3 rotate-180"
                    />
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`ml-2 relative inline-flex items-center p-2 text-xs font-medium rounded-md hover:bg-yellow-300 cursor-pointer ${
                        currentPage === totalPages ? "hidden" : ""
                    }`}
                >
                    <img
                        src="/assets/icons/next-button.png"
                        alt=""
                        className="w-3 h-3"
                    />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
