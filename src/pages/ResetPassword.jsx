import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import aos from "aos";
import "aos/dist/aos.css";
import LeftPanel from "../components/LeftPanel";
import "../components/Auth.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        aos.init({
            duration: 900,
            once: true,
        });
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            setErrorMsg("Reset token is missing or invalid.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/users/reset-password", {
                token,
                newPassword,
            })
            .then((res) => {
                setLoading(false);
                setSuccessMsg(res.data.message || "Password reset successful.");
                setTimeout(() => {
                    navigate("/signin", { replace: true });
                }, 1500);
            })
            .catch((err) => {
                setLoading(false);
                setErrorMsg(
                    err.response?.data?.message || "Unable to reset password. Please try again."
                );
            });
    };

    return (
        <div className="d-flex align-items-stretch h-100 auth-layout auth-page">
            <LeftPanel
                style="fs-1 mt-5"
                head="Create a New Password"
                pStyle="fs-5"
                p="Choose a new password and sign back into your EventFlow account."
            />

            <div
                data-aos="fade-left"
                style={{
                    backgroundColor: "rgb(249,250,251)",
                    padding: "4.6em 2em",
                }}
                className="w-50 auth-content"
            >
                <div
                    style={{ width: "450px" }}
                    className="bg-white mx-auto py-5 px-4 shadow-sm rounded-3 auth-form-card"
                >
                    <h4 className="fw-semibold">Reset Password</h4>
                    <p className="text-secondary">Enter your new password below.</p>

                    <form onSubmit={handleSubmit} data-aos="fade-up">
                        <div className="mb-3">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                className="form-control shadow-none border-2 m-0"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-control shadow-none border-2 m-0"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {errorMsg && (
                            <div className="fw-semibold text-danger text-center mb-3">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="alert alert-success mt-2 mb-3" role="alert">
                                {successMsg} Redirecting to sign in...
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{ backgroundColor: "rgb(226,131,8)" }}
                            className="btn w-100 py-2 text-white fw-semibold my-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                        <p className="m-0 text-center">
                            Remembered your password?{" "}
                            <Link to="/signin">
                                <span className="text-primary fw-semibold">
                                    Back to Sign In
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;