import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";

function EditProfile({ userId, name, image, handleClose }) {
    const [preview, setPreview] = useState(null);
    const { data, setData, post } = useForm({
        _method: "PUT",
        name: name,
        image: image,
    });
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setData("image", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const submit = (e) => {
        e.preventDefault();
        post(`/user/${userId}`);
    };
    return (
        <div className="border p-5 rounded-lg shadow-lg">
            <div className="flex justify-end mb-5">
                <div
                    className="bg-pink-400 p-2 rounded-md text-center cursor-pointer w-7"
                    onClick={handleClose}
                >
                    <img
                        src="/assets/icons/plus.png"
                        alt=""
                        className="w-3 h-3 rotate-45"
                    />
                </div>
            </div>
            <img
                src={`${preview === null ? `storage/${data.image}` : preview}`}
                alt=""
                className="w-full h-32 object-cover rounded-lg mx-auto"
            />
            <form action="" onSubmit={submit}>
                <div className="my-5">
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="mt-2 block w-full text-sm text-gray-500
                                   file:mr-4 file:py-2 file:px-4
                                   file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="my-5">
                    <InputLabel htmlFor="name" value="Masukan Nama" />
                    <TextInput
                        type="text"
                        name="name"
                        className="w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                <div className="flex justify-end mt-5">
                    <PrimaryButton>Save</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
