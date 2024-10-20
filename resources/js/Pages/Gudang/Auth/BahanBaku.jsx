import React, { useState } from "react";
import NavbarGudang from "../Layouts/NavbarGudang";
import { navbarGudang } from "../Data/NavbarGudang";
import Label from "@/Components/Label";
import { useForm } from "@inertiajs/react";
import RoleAccess from "@/Middleware/RoleAcces";
import NotificationSuccess from "@/Components/NotificationSuccess";
import PopOver from "@/Components/PopOver";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

function BahanBaku({ auth }) {
    const [view, setView] = useState("bahan baku");
    const [sukses, setSuccess] = useState(false);
    const { data, setData, post, errors } = useForm({
        id_bahan_baku: "",
        nama_bahan_baku: "",
        stok_bahan_baku: 0,
        minimum_stok: 0,
        satuan_bahan_baku: "",
        harga_bahan_baku: "",
        user_id: auth.user.id,
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/bahan-baku-gudang");
        setSuccess(true);
    };

    return (
        <RoleAccess auth={auth} role={"gudang"}>
            {errors.message && (
                <PopOver>
                    <div className="flex flex-col items-center bg-white p-5 rounded w-96">
                        <p className="text-center mb-5">{errors.message}</p>
                        <PrimaryButton onClick={() => window.location.reload()}>
                            Coba lagi
                        </PrimaryButton>
                    </div>
                </PopOver>
            )}
            <NavbarGudang navbar={navbarGudang} title={"Bahan Baku"}>
                {sukses && (
                    <NotificationSuccess message={"berhasil memasukan data"} />
                )}
                <div className="ml-20 mt-10">
                    <div className="text-sm mb-5 flex gap-2 items-center border-b border-dashed">
                        <Label
                            className={"bg-green-500"}
                            rotate={"rotate-90"}
                        />
                        <h1 className="font-bold pb-2">
                            Menu Bahan Baku &rarr;
                        </h1>
                        <p
                            className={`cursor-pointer text-center hover:text-green-500 pb-2 ${
                                view === "bahan baku"
                                    ? "border-b-2 border-green-500 pb-2"
                                    : ""
                            }`}
                            onClick={() => setView("bahan baku")}
                        >
                            Bahan Baku
                        </p>
                        <p
                            className={`cursor-pointer text-center hover:text-green-500 pb-2 ${
                                view === "tambah bahan baku"
                                    ? "border-b-2 border-green-500 pb-2"
                                    : ""
                            }`}
                            onClick={() => setView("tambah bahan baku")}
                        >
                            Tambah Bahan Baku
                        </p>
                    </div>

                    {view === "bahan baku" ? (
                        <div>Bahan Baku</div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="w-96 mx-auto p-5 border border-dashed border-pink-500 rounded-lg"
                        >
                            <div className="flex gap-2 items-center font-bold border-b border-dashed pb-3">
                                <Label
                                    className={"bg-green-500"}
                                    rotate={"rotate-90"}
                                />
                                <p>Menambahkan bahan baku</p>
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="email"
                                    value="Id bahan baku"
                                />
                                <TextInput
                                    id="id_bahan_baku"
                                    type="text"
                                    name="id_bahan_baku"
                                    value={data.id_bahan_baku}
                                    className="mt-1 block w-full"
                                    autoComplete="id_bahan_baku"
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.id_bahan_baku}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="nama_bahan_baku"
                                    value="Nama bahan baku"
                                />
                                <TextInput
                                    id="nama_bahan_baku"
                                    type="text"
                                    name="nama_bahan_baku"
                                    value={data.nama_bahan_baku}
                                    className="mt-1 block w-full"
                                    autoComplete="nama_bahan_baku"
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.nama_bahan_baku}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="satuan_bahan_baku"
                                    value="Satuan bahan baku"
                                />
                                <TextInput
                                    id="satuan_bahan_baku"
                                    type="text"
                                    name="satuan_bahan_baku"
                                    value={data.satuan_bahan_baku}
                                    className="mt-1 block w-full"
                                    autoComplete="satuan_bahan_baku"
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.satuan_bahan_baku}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="harga_bahan_baku"
                                    value="Harga bahan baku"
                                />
                                <TextInput
                                    id="harga_bahan_baku"
                                    type="number"
                                    name="harga_bahan_baku"
                                    value={data.harga_bahan_baku}
                                    className="mt-1 block w-full"
                                    autoComplete="harga_bahan_baku"
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.harga_bahan_baku}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex justify-end mt-5">
                                <PrimaryButton>Tambah</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </NavbarGudang>
        </RoleAccess>
    );
}

export default BahanBaku;
