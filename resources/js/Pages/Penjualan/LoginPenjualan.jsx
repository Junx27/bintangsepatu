import React from "react";
import Login from "../Auth/Login";

function LoginPenjualan() {
    return (
        <Login
            role={"tim penjualan"}
            href={"/welcome-penjualan"}
            hrefRegister={"/register-penjualan"}
        />
    );
}

export default LoginPenjualan;
