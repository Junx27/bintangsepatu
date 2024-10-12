import React from "react";
import Register from "../Auth/Register";

function SignUpPenjualan() {
    return (
        <Register
            href={"/welcome-penjualan"}
            roleInput={"penjualan"}
            hreflogin={"/login-penjualan"}
        />
    );
}

export default SignUpPenjualan;
