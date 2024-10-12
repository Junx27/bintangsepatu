import React from "react";
import Register from "../Auth/Register";

function SignUpProduksi() {
    return (
        <Register
            href={"/welcome-produksi"}
            roleInput={"produksi"}
            hreflogin={"/login-produksi"}
        />
    );
}

export default SignUpProduksi;
