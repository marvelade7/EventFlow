import React, { useEffect, useRef, useState } from "react";
import CreateEventNav from "../components/CreateEventNav";
import aos from "aos";
import "aos/dist/aos.css";
import { useOutletContext } from "react-router-dom";
import {
    getStoredUserProfile,
    saveUserProfileDetails,
} from "../utils/userProfile";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const fileInputRef = useRef(null);
    const { sidebarOpen, toggleSidebar } = useOutletContext();

    const storedProfile = getStoredUserProfile();
    const initialProfile = {
        firstName: storedProfile?.firstName || "John",
        lastName: storedProfile?.lastName || "Doe",
        email: storedProfile?.email || "",
        bio: storedProfile?.bio || "",
        phoneNumber: storedProfile?.phoneNumber || "",
        avatar:
            storedProfile?.avatar ||
            "https://randomuser.me/api/portraits/men/32.jpg",
        location: storedProfile?.location || "",
    };
    const [profileData, setProfileData] = useState(initialProfile);

    useEffect(() => {
        aos.init({
            duration: 650,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });
    }, []);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileAction = () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        saveUserProfileDetails(profileData);
        setIsEditing(false);
    };

    const handleAvatarPickerOpen = () => {
        if (!isEditing) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setAvatarError("Please choose a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== "string") {
                return;
            }

            setProfileData((prev) => ({ ...prev, avatar: reader.result }));
            setAvatarError("");
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    return (
        <div
            className="dashboard-main"
            style={{ marginLeft: "300px", background: "rgb(249,250,251)" }}
        >
                <CreateEventNav
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={sidebarOpen}
                    title="My Profile"
                    actionLabel={isEditing ? "Save Details" : "Edit Profile"}
                    onActionClick={handleProfileAction}
                />

                <div className="px-4 py-4" data-aos="fade-up">
                    <div
                        className="bg-white rounded-4 shadow-sm p-4"
                        style={{ maxWidth: "980px" }}
                    >
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4" data-aos="fade-up" data-aos-delay="60">
                            <div>
                                <h5 className="m-0 fw-semibold">Profile Details</h5>
                                <p className="m-0 text-secondary">
                                    Click Edit Profile to update your information.
                                </p>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={profileData.avatar}
                                    alt="Profile"
                                    width="72"
                                    height="72"
                                    onClick={handleAvatarPickerOpen}
                                    className="rounded-circle border object-fit-cover"
                                    style={{ cursor: isEditing ? "pointer" : "default" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={!isEditing}
                                    onClick={handleAvatarPickerOpen}
                                >
                                    Upload New Photo
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleAvatarUpload}
                                />
                            </div>
                        </div>

                        {avatarError ? (
                            <p className="text-danger fw-semibold mb-3">{avatarError}</p>
                        ) : null}

                        <div className="row g-3" data-aos="fade-up" data-aos-delay="120">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    value={profileData.firstName}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    value={profileData.lastName}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={profileData.email}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="form-control"
                                    value={profileData.phoneNumber}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="3"
                                    className="form-control"
                                    value={profileData.bio}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                ></textarea>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-control"
                                    value={profileData.location}
                                    onChange={handleFieldChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="col-12">
                                <button
                                    type="button"
                                    className="btn text-white fw-semibold px-4 py-2"
                                    style={{ backgroundColor: "rgb(17,213,243)" }}
                                    onClick={handleProfileAction}
                                >
                                    {isEditing ? "Save Details" : "Edit Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Profile;
