import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ canResetPassword, role, href, hrefRegister }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="bg-[url('/assets/bg.jpg')] bg-cover bg-center h-screen p-10">
            <div className="flex items-center bg-white w-full h-full rounded-3xl overflow-hidden">
                <div className="fixed w-full top-5 p-10">
                    {href && (
                        <div className="flex justify-between">
                            <a
                                href={href}
                                className="font-bold hover:bg-blue-50 p-2 rounded-md"
                            >
                                &larr; Kembali
                            </a>
                        </div>
                    )}
                    {!href && (
                        <div className="flex justify-between">
                            <a
                                href="/"
                                className="font-bold hover:bg-blue-50 p-2 rounded-md"
                            >
                                &larr; Kembali
                            </a>
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <img
                        src="/assets/delay.png"
                        alt=""
                        className="mx-auto mt-5 w-64 h-64"
                    />
                    <p className="mb-4 font-bold text-xl text-center">
                        Sistem Informasi Inventori dan Produksi (SIIP)
                    </p>
                    <p className="mx-20 text-center border-b border-t border-dashed py-10">
                        Ini adalah situs web yang khusus dibuat untuk mendukung
                        operasi internal kami, memungkinkan kolaborasi antara
                        tim untuk memastikan bahwa proses produksi berjalan
                        dengan baik dan lancar. Dengan integrasi sistem, setiap
                        tim memiliki akses ke fitur dan fungsi yang dapat
                        disesuaikan sesuai kebutuhan, yang memungkinkan berbagi
                        informasi real-time dan integrasi kerja yang lebih
                        mudah.
                    </p>
                    <p className="text-center text-xs mt-5 text-gray-700">
                        &copy; Copy Right Bintang Sepatu
                    </p>
                </div>
                <form
                    onSubmit={submit}
                    className="w-[600px] h-full p-10 pb-20 bg-white shadow-lg"
                >
                    <h1 className="font-black uppercase my-2 text-center">
                        login
                    </h1>
                    <div className="flex justify-center items-center gap-2">
                        <img
                            src="/assets/logo.png"
                            alt=""
                            className="w-6 h-6"
                        />
                        <h2 className="font-black text-[#0C15F7]">
                            BINTANG SEPATU
                        </h2>
                    </div>
                    <div className="mt-20 border-t border-dashed pt-5">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <p className="font-bold my-4 uppercase">role {role}</p>
                    <div className="my-4 mt-10 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Ingatkan saya
                            </span>
                        </label>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-blue-600 underline hover:text-gray-900"
                        >
                            Lupa kata sandi?
                        </Link>
                        <a
                            href={hrefRegister}
                            className="rounded-md text-sm text-blue-600 underline hover:text-gray-900"
                        >
                            Belum mempunyai akun?
                        </a>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
