import React from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

const CheckoutNav = ({ title = "Checkout Page" }) => {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex sticky-top align-items-center justify-content-center bg-white py-3 shadow-sm checkout-nav"
            style={{ gap: "16px" }}
        >
            {/* <Logo size="36px" fontSize="1.1em" /> */}
            <div className="d-flex align-items-center justify-content-between w-100" style={{maxWidth: '1200px', padding: '0 1em'}} >
                <h5 className="m-0 text-end fw-semibold">{title}</h5>
                <button
                        type="button"
                        className="border-0 px-3 py-1 rounded-2 shadow-sm"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <i className="bi bi-arrow-left" />
                    </button>
            </div>
        </div>
    );
};

export default CheckoutNav;
