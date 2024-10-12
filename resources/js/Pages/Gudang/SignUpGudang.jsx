import React from "react";
import Register from "../Auth/Register";

function SignUpGudang() {
    return (
        <Register
            href={"/welcome-gudang"}
            roleInput={"gudang"}
            hreflogin={"/login-gudang"}
        />
    );
}

export default SignUpGudang;
