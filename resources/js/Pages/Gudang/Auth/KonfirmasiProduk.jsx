import RoleAccess from "@/Middleware/RoleAccess";
import React, { useEffect, useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import DataProdukMasuk from "../Layouts/DataProdukMasuk";
import Label from "@/Components/Label";
import axios from "axios";
import FormateDate from "@/Components/FormateDate";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PopOver from "@/Components/PopOver";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import _ from "lodash";
import Notification from "@/Components/Notification";

function KonfirmasiProduk({ auth }) {
    const navigasi = [
        {
            nama: "konfirmasi produk masuk",
            icon: "/assets/icons/enroll.png",
        },
        {
            nama: "verifikasi produk masuk",
            icon: "/assets/icons/preparation.png",
        },
        {
            nama: "konfirmasi pesanan masuk",
            icon: "/assets/icons/shopping.png",
        },
    ];
    const [view, setView] = useState("konfirmasi produk masuk");
    const [idProdukMasuk, setIdProdukMasuk] = useState(null);
    const [jumlahProdukMasuk, setJumlahIdProdukMasuk] = useState(0);
    const [dataProdukMasuk, setDataProdukMasuk] = useState([]);
    const [konfirmasiProduk, setKonfirmasiProduk] = useState(false);
    const { data, setData, put } = useForm({
        tanggal_penerimaan_produk: "",
        jumlah_produk_diterima: jumlahProdukMasuk,
    });

    const filterProdukMasuk = dataProdukMasuk.filter(
        (item) => item.status_penerimaan_produk === "pending"
    );
    const filterProdukMasukVerifikasi = dataProdukMasuk.filter(
        (item) => item.status_penerimaan_produk === "diterima"
    );

    useEffect(() => {
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProdukMasuk(response.data);
        };
        if (jumlahProdukMasuk > 0) {
            setData("jumlah_produk_diterima", jumlahProdukMasuk);
        }
        fetchDataProdukMasuk();
    }, [jumlahProdukMasuk]);
    const handleKonfirmasiUpdate = (id, jumlahProduk) => {
        setIdProdukMasuk(id);
        setJumlahIdProdukMasuk(jumlahProduk);
        setKonfirmasiProduk(true);
    };
    const sumbitProdukMasuk = (e) => {
        e.preventDefault();
        put(`/laporan-gudang/${idProdukMasuk}`);
    };
    return (
        <RoleAccess auth={auth} role={"gudang"}>
            <NavbarGudang
                navbar={navbarGudang}
                title={"Produk Masuk"}
                auth={auth}
                navigasi={
                    <div className="text-sm flex gap-2 items-center bg-white w-full">
                        <Label
                            className={"bg-[#0C15F7]"}
                            rotate={"rotate-90"}
                        />
                        {navigasi.map((item) => (
                            <div
                                key={item.nama}
                                className={`relative text-[8px] p-2 px-3 rounded-md cursor-pointer mr-5 text-center hover:bg-blue-50 overflow-hidden ${
                                    view === item.nama ? "bg-blue-50" : ""
                                }`}
                                onClick={() => setView(item.nama)}
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <img
                                        src={item.icon}
                                        alt=""
                                        className="w-4 h-4"
                                    />
                                    <p className="">
                                        {item.nama.charAt(0).toUpperCase() +
                                            item.nama.slice(1)}
                                    </p>
                                    <div
                                        className={`absolute top-8 w-full h-2 -ml-3 bg-[#0C15F7] transition-opacity duration-300 ${
                                            view === item.nama
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    ></div>
                                    <Notification
                                        nama={item.nama}
                                        parameter={"konfirmasi produk masuk"}
                                        data={filterProdukMasuk}
                                    />
                                    <Notification
                                        nama={item.nama}
                                        parameter={"verifikasi produk masuk"}
                                        data={filterProdukMasukVerifikasi}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                }
            >
                <div className="ml-20 mt-5 h-screen overflow-auto">
                    {view === "verifikasi produk masuk" ? (
                        <div>
                            <DataProdukMasuk />
                        </div>
                    ) : (
                        <div className="pb-32">
                            <div
                                className={`grid grid-cols-5 gap-5 mt-5 ${
                                    konfirmasiProduk ? "hidden" : "block"
                                }`}
                            >
                                {filterProdukMasuk.map((i) => (
                                    <div
                                        key={i.id}
                                        className="cursor-pointer relative group shadow-lg rounded-xl p-5"
                                    >
                                        <div className="w-full h-32">
                                            <img
                                                src={`storage/${i.produk.gambar_produk}`}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <h1 className="font-black uppercase bg-yellow-500/20 text-center p-2 rounded-md my-2">
                                            {i.id_produksi_masuk}
                                        </h1>
                                        <h1 className="font-black border-b border-dashed pb-2">
                                            ID: {i.id_produk}
                                        </h1>
                                        <div>
                                            <Label className={"bg-red-500"} />
                                            <p className="capitalize">
                                                {i.produk.nama_produk}{" "}
                                                <span className="bg-red-500/20 text-red-500 lowercase relative ml-3 rounded-md text-center p-1 text-[10px] font-normal px-3">
                                                    {i.status_penerimaan_produk}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="mt-3 text-xs">
                                                <p>
                                                    Tanggal Pengiriman: <br />
                                                    <span className="font-bold">
                                                        <FormateDate
                                                            data={
                                                                i.tanggal_pengiriman_produk
                                                            }
                                                        />
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-3 text-xs">
                                                <p>
                                                    QTY: <br />
                                                    <span className="font-bold">
                                                        {i.jumlah_produksi}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="text-[10px] group-hover:block hidden absolute z-20 bottom-20 mb-6 right-5 cursor-pointer bg-green-300 p-1 px-2 rounded-md"
                                            onClick={() =>
                                                handleKonfirmasiUpdate(
                                                    i.id,
                                                    i.jumlah_produksi
                                                )
                                            }
                                        >
                                            <p>Verifikasi</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {konfirmasiProduk && (
                                <div className="cursor-pointer relative group shadow-lg rounded-xl p-5 w-72">
                                    <div className="flex justify-end mb-2">
                                        <div
                                            className="bg-pink-400 p-2 rounded-md text-center  cursor-pointer w-7"
                                            onClick={() =>
                                                setKonfirmasiProduk(false)
                                            }
                                        >
                                            <img
                                                src="/assets/icons/plus.png"
                                                alt=""
                                                className="w-3 h-3 rotate-45"
                                            />
                                        </div>
                                    </div>
                                    <form
                                        action=""
                                        onSubmit={sumbitProdukMasuk}
                                    >
                                        <div className="my-3">
                                            <InputLabel
                                                htmlFor="tanggal_penerimaan_produk"
                                                value="Konfirmasi tanggal"
                                            />
                                            <TextInput
                                                id="tanggal_penerimaan_produk"
                                                type="date"
                                                name="tanggal_penerimaan_produk"
                                                value={
                                                    data.tanggal_penerimaan_produk
                                                }
                                                className="mt-1 block w-full"
                                                autoComplete="tanggal_penerimaan_produk"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData(
                                                        "tanggal_penerimaan_produk",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={""}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="my-3">
                                            <TextInput
                                                id="jumlah_produk_diterima"
                                                type="number"
                                                name="jumlah_produk_diterima"
                                                value={
                                                    data.jumlah_produk_diterima
                                                }
                                                className="mt-1 hidden w-full"
                                                autoComplete="jumlah_produk_diterima"
                                                isFocused={true}
                                            />
                                            <InputError
                                                message={""}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <PrimaryButton>
                                                konfimasi penerimaan produk
                                                masuk
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default KonfirmasiProduk;
