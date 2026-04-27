import React, { useEffect, useRef, useState } from "react";
import CreateEventNav from "../components/CreateEventNav";
import aos from "aos";
import "aos/dist/aos.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import Avatar from "../components/Avatar";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [requestSuccess, setRequestSuccess] = useState("");
    const fileInputRef = useRef(null);
    const { sidebarOpen, toggleSidebar } = useOutletContext();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        phoneNumber: "",
        avatar: "", // preview URL
        file: null, // actual file for backend
        location: "",
    });

    useEffect(() => {
        aos.init({
            duration: 650,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        axios
            .get("https://eventflow-backend-fwv4.onrender.com/api/users/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                const user = res.data?.user || {};
                setProfileData((prev) => ({
                    ...prev,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    bio: user.bio || "",
                    phoneNumber: user.phoneNumber || "",
                    avatar: user.profilePic || "",
                    location: user.location || "",
                }));
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setRequestError(
                    err.response?.data?.message ||
                        "Unable to load your profile from the server.",
                );
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
        if (requestError) setRequestError("");
        if (requestSuccess) setRequestSuccess("");
    };

    const handleProfileAction = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setIsSaving(true);
        setRequestError("");
        setRequestSuccess("");

        try {
            const formData = new FormData();

            formData.append("firstName", profileData.firstName);
            formData.append("lastName", profileData.lastName);
            formData.append("email", profileData.email);
            formData.append("bio", profileData.bio);
            formData.append("phoneNumber", profileData.phoneNumber);
            formData.append("location", profileData.location);

            // 👇 only send file if user selected one
            if (profileData.file) {
                formData.append("profilePic", profileData.file);
            }

            const response = await axios.patch(
                "http://localhost:5000/api/users/update-user",
                // "https://eventflow-backend-fwv4.onrender.com/api/users/update-user",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            const updatedUser = response.data.user;

            setProfileData((prev) => ({
                ...prev,
                firstName: updatedUser.firstName || prev.firstName,
                lastName: updatedUser.lastName || prev.lastName,
                email: updatedUser.email || prev.email,
                bio: updatedUser.bio || prev.bio,
                phoneNumber: updatedUser.phoneNumber || prev.phoneNumber,
                avatar: updatedUser.profilePic || prev.avatar, // 👈 from backend
                location: updatedUser.location || prev.location,
                file: null, // reset after upload
            }));

            setIsEditing(false);
            setRequestSuccess("Profile updated successfully.");
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setRequestError(
                err.response?.data?.message ||
                    "Unable to update profile right now.",
            );
        } finally {
            setIsSaving(false);
        }
    };
    const handleAvatarPickerOpen = () => {
        if (!isEditing) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setAvatarError("Please choose a valid image file.");
            return;
        }

        setProfileData((prev) => ({
            ...prev,
            file: file, // 👈 important for backend
            avatar: URL.createObjectURL(file), // 👈 preview
        }));

        setAvatarError("");
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
                actionLabel={
                    isSaving
                        ? "Saving..."
                        : isEditing
                          ? "Save Details"
                          : "Edit Profile"
                }
                onActionClick={handleProfileAction}
            />

            <div className="px-4 py-4" data-aos="fade-up">
                <div
                    className="bg-white rounded-4 shadow-sm p-4"
                    style={{ maxWidth: "980px" }}
                >
                    <div
                        className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4"
                        data-aos="fade-up"
                        data-aos-delay="60"
                    >
                        <div>
                            <h5 className="m-0 fw-semibold">Profile Details</h5>
                            <p className="m-0 text-secondary">
                                Click Edit Profile to update your information.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <Avatar
                                firstName={profileData.firstName}
                                lastName={profileData.lastName}
                                avatarUrl={profileData.avatar}
                                width="72px"
                                height="72px"
                                fontSize="1.4em"
                                className="border"
                                style={{
                                    cursor: isEditing ? "pointer" : "default",
                                }}
                                onClick={handleAvatarPickerOpen}
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
                        <p className="text-danger fw-semibold mb-3">
                            {avatarError}
                        </p>
                    ) : null}

                    {requestError ? (
                        <p className="text-danger fw-semibold mb-3">
                            {requestError}
                        </p>
                    ) : null}

                    {requestSuccess ? (
                        <p className="text-success fw-semibold mb-3">
                            {requestSuccess}
                        </p>
                    ) : null}

                    {loading ? (
                        <p className="text-secondary fw-semibold mb-3">
                            Loading profile details...
                        </p>
                    ) : null}

                    <div
                        className="row g-3"
                        data-aos="fade-up"
                        data-aos-delay="120"
                    >
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                value={profileData.firstName}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                value={profileData.lastName}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={profileData.email}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-control"
                                value={profileData.phoneNumber}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                rows="3"
                                className="form-control"
                                value={profileData.bio}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            ></textarea>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                value={profileData.location}
                                onChange={handleFieldChange}
                                disabled={!isEditing || loading || isSaving}
                            />
                        </div>

                        <div className="col-12">
                            <button
                                type="button"
                                className="btn text-white fw-semibold px-4 py-2"
                                style={{ backgroundColor: "rgb(17,213,243)" }}
                                onClick={handleProfileAction}
                                disabled={loading || isSaving}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : isEditing
                                      ? "Save Details"
                                      : "Edit Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
