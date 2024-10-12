import { Link } from "@inertiajs/react";
import React from "react";

function NotFoundPage() {
    return (
        <div className="pattern-1">
            <h1 className="text-center font-bold mt-32 text-3xl">
                404 - Page Not Found
            </h1>
            <Link
                href="/logout"
                method="post"
                className="flex justify-center mt-10"
            >
                &larr; Go Back
            </Link>
        </div>
    );
}

export default NotFoundPage;
