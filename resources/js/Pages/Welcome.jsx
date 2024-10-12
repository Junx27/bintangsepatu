import { Head } from "@inertiajs/react";
import React from "react";

function Welcome() {
    return (
        <div className="bg-[url('/assets/bg.jpg')] bg-cover bg-center h-screen p-10">
            <Head title="Landing Page" />
            <div className="w-full h-full bg-white rounded-3xl p-10">
                <div className="flex justify-start items-center gap-2">
                    <img src="/assets/logo.png" alt="" className="w-6 h-6" />
                    <h2 className="font-black text-[#0C15F7]">
                        BINTANG SEPATU
                    </h2>
                </div>
                <h1 className="mt-12 font-bold text-3xl text-center">
                    Sistem Informasi Inventori dan Produksi (SIIP)
                </h1>
                <p className="mt-3 text-center border-b border-dashed pb-5">
                    "Kolaborasi Tanpa Batas untuk Proses Produksi yang Sempurna,
                    Menyatukan Tim untuk Produksi yang Lebih Lancar."
                </p>
                <div className="grid grid-cols-4 gap-10 mt-10">
                    <div className="transition-all duration-500 w-full shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/unboxing.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            tim penjualan
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/welcome-penjualan">Selengkapnya &rarr;</a>
                        </div>
                    </div>
                    <div className="transition-all duration-500 w-full shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/tracking.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            tim produksi
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/welcome-produksi">Selengkapnya &rarr;</a>
                        </div>
                    </div>
                    <div className="transition-all duration-500 w-full shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/warranty.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            tim gudang
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/welcome-gudang">Selengkapnya &rarr;</a>
                        </div>
                    </div>
                    <div className="transition-all duration-500 w-full shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/delivery.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            tim pengiriman
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/welcome-pengiriman">
                                Selengkapnya &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
