import React from "react";
import Login from "../Auth/Login";

function LoginPengiriman() {
    return (
        <Login
            role={"tim pengiriman"}
            href={"/welcome-pengiriman"}
            hrefRegister={"/register-pengiriman"}
        />
    );
}

export default LoginPengiriman;
