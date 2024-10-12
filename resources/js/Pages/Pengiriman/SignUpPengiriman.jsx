import React from "react";
import Register from "../Auth/Register";

function SignUpPengiriman() {
    return (
        <Register
            href={"/welcome-pengiriman"}
            roleInput={"pengiriman"}
            hreflogin={"/login-pengiriman"}
        />
    );
}

export default SignUpPengiriman;
