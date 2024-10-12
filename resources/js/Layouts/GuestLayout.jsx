import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head, Link } from "@inertiajs/react";

export default function Guest({ children, title }) {
    return (
        <div className="bg-[url('/assets/bg.jpg')] bg-cover bg-center h-screen p-10">
            <Head title={title} />
            <div className="fixed w-full top-5 p-10">
                <div className="flex justify-between">
                    <a
                        href="/"
                        className="font-bold hover:bg-blue-50 p-2 rounded-md"
                    >
                        &larr; Kembali
                    </a>
                </div>
            </div>
            <div className="w-full h-full bg-white rounded-3xl p-10">
                {children}
            </div>
        </div>
    );
}
