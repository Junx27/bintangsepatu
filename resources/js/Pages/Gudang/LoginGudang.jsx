import React from "react";
import Login from "../Auth/Login";

function LoginGudang() {
    return (
        <Login
            role={"tim gudang"}
            href={"/welcome-gudang"}
            hrefRegister={"/register-gudang"}
        />
    );
}

export default LoginGudang;
