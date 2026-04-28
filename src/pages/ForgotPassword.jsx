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

    useEffect(() => {
        aos.init({
            duration: 900,
            once: true,
            easing: "ease-out-cubic",
        });
    }, []);

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
            })
            .catch((err) => {
                setLoading(false);
                setErrorMsg(
                    err.response?.data?.message ||
                        "Unable to send reset link. Please try again."
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
        </div>
    );
};

export default ForgotPassword;
