import React from "react";

function HeaderLaporan() {
    return (
        <div className="relative">
            <div className="absolute top-2">
                <img src="/assets/logo.png" alt="" className="w-8 h-8" />
            </div>
            <h1 className="font-black uppercase text-center text-xl">
                laporan bagian produksi
            </h1>
            <h2 className="text-center font-bold text-sm">
                Sistem Informasi Inventori dan Produksi (SIIP)
            </h2>
        </div>
    );
}

export default HeaderLaporan;
