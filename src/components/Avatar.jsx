import React from "react";
import { stringToColor } from "../utils/stringToColor";

const getInitials = (firstName = "", lastName = "") => {
    return (firstName[0] || "") + (lastName[0] || "");
};

const Avatar = ({
    firstName,
    lastName,
    avatarUrl,
    width = "50px",
    height = "40px",
    fontSize = "16px",
    className = "",
    style = {},
    onClick,
}) => {
    const initials = getInitials(firstName, lastName).toUpperCase();
    const bgColor = stringToColor(firstName + lastName);
    const hasAvatar = Boolean(avatarUrl && avatarUrl.trim());

    if (hasAvatar) {
        return (
            <img
                src={avatarUrl}
                alt="Profile"
                onClick={onClick}
                className={`rounded-circle object-fit-cover ${className}`.trim()}
                style={{ width, height, ...style }}
            />
        );
    }

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: bgColor,
                width,
                height,
                fontSize,
                ...style,
            }}
            className={`rounded-circle text-white d-flex justify-content-center align-items-center fw-bold ${className}`.trim()}
        >
            {initials || " "}
        </div>
    );
};

export default Avatar;
