import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";
import "../components/Auth.css";
import aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        aos.init({
            duration: 900,
            once: true,
            easing: "ease-out-cubic",
        });
    }, []);

    const showNotification = (message, type = "info") => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications((prev) => [...prev, notification]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setSubmitted(false);

        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/users/forgot-password", {
                email: email.trim().toLowerCase(),
            })
            .then(() => {
                setLoading(false);
                setSubmitted(true);
                showNotification("Reset link sent to your email!", "success");
            })
            .catch((err) => {
                setLoading(false);
                showNotification(
                    err.response?.data?.message || "Unable to send reset link. Please try again.",
                    "error"
                );
            });
    };

    return (
        <div className="d-flex align-items-stretch h-100 auth-layout auth-page">
            <LeftPanel
                style="fs-1 mt-5"
                head="Reset Your Password"
                pStyle="fs-5"
                p="No stress. Enter your account email and we will send a secure reset link to get you back into EventFlow."
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
                    <h4 className="fw-semibold">Forgot Password?</h4>
                    <p className="text-secondary">
                        Enter your email and we will send a reset link.
                    </p>

                    <form onSubmit={handleSubmit} data-aos="fade-up">
                        <div className="mb-3">
                            <label htmlFor="resetEmail">Email Address</label>
                            <input
                                id="resetEmail"
                                type="email"
                                className="form-control shadow-none border-2 m-0"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

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
                                    Sending Link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>

                        {errorMsg && (
                            <div className="fw-semibold text-danger text-center mb-3">
                                {errorMsg}
                            </div>
                        )}

                        {submitted && (
                            <div
                                className="alert alert-success mt-2 mb-3"
                                role="alert"
                            >
                                Reset link sent. Check your inbox for next steps.
                            </div>
                        )}

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

            {/* Toast Notifications */}
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    maxWidth: "500px",
                    width: "90%",
                }}
            >
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            marginBottom: "10px",
                            animation: "slideIn 0.3s ease-in-out",
                        }}
                    >
                        <div
                            className={`alert alert-${
                                notification.type === "success"
                                    ? "success"
                                    : notification.type === "error"
                                    ? "danger"
                                    : "info"
                            } d-flex align-items-center gap-2 mb-0`}
                            role="alert"
                            style={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                animation: "slideOut 0.3s ease-in-out 2.7s forwards",
                            }}
                        >
                            {notification.type === "success" && (
                                <i className="bi bi-check-circle-fill"></i>
                            )}
                            {notification.type === "error" && (
                                <i className="bi bi-exclamation-circle-fill"></i>
                            )}
                            {notification.type === "info" && (
                                <i className="bi bi-info-circle-fill"></i>
                            )}
                            <span>{notification.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    to {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
