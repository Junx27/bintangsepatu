import React from "react";
import Login from "../Auth/Login";

function LoginProduksi() {
    return (
        <Login
            role={"tim produksi"}
            href={"/welcome-produksi"}
            hrefRegister={"/register-produksi"}
        />
    );
}

export default LoginProduksi;
