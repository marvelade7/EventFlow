import React from "react";
import Logo from "./Logo";

const CheckoutNav = ({ title = "Checkout Page" }) => {

    return (
        <div
            className="d-flex sticky-top align-items-center justify-content-center bg-white py-3 shadow-sm checkout-nav"
            style={{ gap: "16px" }}
        >
            {/* <Logo size="36px" fontSize="1.1em" /> */}
            <div className="d-flex align-items-center justify-content-between w-100" style={{maxWidth: '1200px', padding: '0 1em'}} >
                <h5 className="m-0 text-end fw-semibold">{title}</h5>
            </div>
        </div>
    );
};

export default CheckoutNav;
