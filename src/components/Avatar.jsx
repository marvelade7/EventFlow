import React from "react";
import { stringToColor } from "../utils/stringToColor";

const getInitials = (firstName = "", lastName = "") => {
    return (firstName[0] || "") + (lastName[0] || "");
};

const Avatar = ({ firstName, lastName }) => {
    const initials = getInitials(firstName, lastName).toUpperCase();
    const bgColor = stringToColor(firstName + lastName);

    return (
        <div
            style={{
                backgroundColor: bgColor,
                width: "50px",
                height: "40px",
                fontSize: "16px",
            }}
            className="rounded-circle text-white d-flex justify-content-center align-items-center fw-bold"
        >
            {initials || "?"}
        </div>
    );
};

export default Avatar;
