import Guest from "@/Layouts/GuestLayout";
import React from "react";

function WelcomePenjualan() {
    return (
        <Guest title={"Welcome Tim Penjualan"}>
            <div>
                <h1 className="mt-12 font-bold text-3xl text-center">
                    Sistem Informasi Inventori dan Produksi (SIIP) <br />
                    Tim Penjualan
                </h1>
                <p className="mt-3 text-center border-b border-dashed pb-5 mx-20">
                    Selamat Datang, di menu Tim Penjualan silahkan melakukan
                    login atau sign up (jika belum memiliki akun), lalu tunggu
                    beberapa saat untuk verifikasi dari pimpinan jika ada notif
                    maka bisa melakukan login.
                </p>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="transition-all duration-500 w-72 shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/login.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            login
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/login-penjualan">Selengkapnya &rarr;</a>
                        </div>
                    </div>
                    <div className="transition-all duration-500 w-72 shadow-lg rounded-xl p-5 hover:shadow-xl hover:bg-yellow-500">
                        <img
                            src="/assets/signup.png"
                            alt=""
                            className="w-64 h-64 object-cover mx-auto border-b border-dashed"
                        />
                        <h1 className="font-black uppercase text-center text-xl mt-5">
                            sign up
                        </h1>
                        <div className="flex justify-center hover:bg-blue-50 p-2 rounded-lg">
                            <a href="/register-penjualan">
                                Selengkapnya &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    );
}

export default WelcomePenjualan;
