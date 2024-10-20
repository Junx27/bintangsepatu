import RoleAccess from "@/Middleware/RoleAcces";
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

function KonfirmasiProduk({ auth }) {
    const [idProdukMasuk, setIdProdukMasuk] = useState(null);
    const [jumlahProdukMasuk, setJumlahIdProdukMasuk] = useState(0);
    const [dataProdukMasuk, setDataProsukMasuk] = useState([]);
    const [konfirmasiProduk, setKonfirmasiProduk] = useState(false);
    const { data, setData, put } = useForm({
        tanggal_penerimaan_produk: "",
        jumlah_produk_diterima: jumlahProdukMasuk,
    });

    const filterProdukMasuk = _.filter(
        dataProdukMasuk,
        (item) => item.status_penerimaan_produk === "pending"
    );

    useEffect(() => {
        const fetchDataProdukMasuk = async () => {
            const response = await axios.get(
                "/api/bintangsepatu/data-produk-masuk-gudang"
            );
            setDataProsukMasuk(response.data);
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
            <NavbarGudang navbar={navbarGudang} title={"Produk Masuk"}>
                <div className="ml-20 mt-10 mr-64 pr-5 h-screen overflow-auto">
                    <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2">
                        <Label
                            className={"bg-green-500"}
                            rotate={"rotate-90"}
                        />
                        <h1 className="font-bold">Daftar produk masuk</h1>
                    </div>
                    <DataProdukMasuk />
                </div>
                <div className="fixed h-screen w-64 top-0 right-0 overflow-auto border-l p-5 pt-20 pb-32">
                    <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed pb-2 mt-2">
                        <Label className={"bg-red-500"} rotate={"rotate-90"} />
                        <h1 className="font-bold">Konfirmasi produk masuk</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-5 mt-5">
                        {filterProdukMasuk.map((i) => (
                            <div
                                key={i.id}
                                className="hover:border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5"
                            >
                                <h1 className="font-black uppercase bg-yellow-500/20 text-center p-2 border border-dashed border-yellow-500 rounded-md mb-2">
                                    {i.id_produksi_masuk}
                                </h1>
                                <h1 className="font-black border-b border-dashed pb-2">
                                    ID: {i.id_produk}
                                </h1>
                                <div>
                                    <Label className={"bg-red-500"} />
                                    <p className="capitalize">
                                        {i.produk.nama_produk}{" "}
                                        <span className="bg-red-500/20 text-red-500 lowercase relative ml-3 rounded-full text-center p-1 text-[10px] font-normal px-3">
                                            {i.status_penerimaan_produk}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <div className="mt-3 text-xs">
                                        <p>
                                            Tanggal Mulai: <br />
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
                                    className="group-hover:block hidden absolute z-20 top-2 right-2 cursor-pointer"
                                    onClick={() =>
                                        handleKonfirmasiUpdate(
                                            i.id,
                                            i.jumlah_produksi
                                        )
                                    }
                                >
                                    <img
                                        src="/assets/icons/plus.png"
                                        alt=""
                                        className="w-7 h-7 bg-green-300 p-2 rounded-md"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {konfirmasiProduk && (
                        <PopOver>
                            <div className="border-pink-500 border border-dashed cursor-pointer relative group shadow-lg rounded-xl p-5 w-72">
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
                                <form action="" onSubmit={sumbitProdukMasuk}>
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
                                            value={data.jumlah_produk_diterima}
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
                                            konfimasi penerimaan produk masuk
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </PopOver>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default KonfirmasiProduk;
