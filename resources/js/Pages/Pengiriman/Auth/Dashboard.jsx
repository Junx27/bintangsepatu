import RoleAccess from "@/Middleware/RoleAccess";
import { Link } from "@inertiajs/react";
import React from "react";

function Dashboard({ auth }) {
    return (
        <RoleAccess auth={auth} role={"pengiriman"}>
            Dashboard tim pengiriman
            <Link
                href={route("logout")}
                method="post"
                as="button"
                className="text-white bg-red-500 p-2"
            >
                logout
            </Link>
        </RoleAccess>
    );
}

export default Dashboard;
