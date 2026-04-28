import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import aos from "aos";
import "aos/dist/aos.css";
import LeftPanel from "../components/LeftPanel";
import "../components/Auth.css";

const EmailVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Get email from localStorage first (most reliable), then fallback to location state
    const email = localStorage.getItem("verificationEmail") || location.state?.email || "";

    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [otpSentTime, setOtpSentTime] = useState(null);

    const handleAutoSendOtp = () => {
        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/users/send-otp-email", {
                email,
            })
            .then(() => {
                setSuccessMsg("OTP sent to your email!");
                setOtpSentTime(Date.now());
                setResendCountdown(60);
            })
            .catch((err) => {
                setErrorMsg(
                    err.response?.data?.message || "Failed to send OTP. Please try manually."
                );
            });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        aos.init({
            duration: 1000,
            once: true,
        });
    }, []);

    // Countdown timer for resend
    useEffect(() => {
        if (resendCountdown <= 0) return;
        
        const timer = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [resendCountdown]);

    // Auto-send OTP when page loads
    useEffect(() => {
        if (email) {
            handleAutoSendOtp();
        }
    }, []); // Empty dependency array - run only once on mount

    if (!email) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="text-center">
                    <h4 className="fw-semibold text-danger mb-3">No Email Found</h4>
                    <p className="text-secondary mb-4">
                        Please sign up first to verify your email.
                    </p>
                    <button
                        className="btn text-white fw-semibold px-4"
                        style={{ backgroundColor: "rgb(226,131,8)" }}
                        onClick={() => navigate("/signup")}
                    >
                        Back to Sign Up
                    </button>
                </div>
            </div>
        );
    }

    const handleVerifyEmail = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/users/verify-email", {
                email,
                otp: verificationCode,
            })
            .then((res) => {
                setLoading(false);
                setSuccessMsg(res.data.message || "Email verified successfully!");
                setShowSuccessModal(true);
                // Clear the email from localStorage after successful verification
                localStorage.removeItem("verificationEmail");
            })
            .catch((err) => {
                setLoading(false);
                setErrorMsg(
                    err.response?.data?.message || "Verification failed. Please try again."
                );
            });
    };

    const handleResendCode = () => {
        if (resendCountdown > 0) return; // Prevent resend if countdown active
        
        setResendLoading(true);
        setErrorMsg("");

        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/users/send-otp-email", {
                email,
            })
            .then(() => {
                setResendLoading(false);
                setSuccessMsg("Verification code sent to your email!");
                setOtpSentTime(Date.now());
                setResendCountdown(60);
                setVerificationCode(""); // Clear input after resending
                setErrorMsg(""); // Clear any previous error messages
            })
            .catch((err) => {
                setResendLoading(false);
                setErrorMsg(
                    err.response?.data?.message || "Failed to resend code. Please try again."
                );
            });
    };

    const handleContinueToSignIn = () => {
        setShowSuccessModal(false);
        navigate("/signin");
    };

    return (
        <div>
            <div className="d-flex align-items-stretch auth-layout auth-page">
                <LeftPanel
                    head="Email Verification"
                    p="Verify your email to secure your EventFlow account."
                    texthead="Why verify your email?"
                    text1="Secure your account"
                    text2="Receive important updates"
                    text3="Enable account recovery"
                    text4="Protect your information"
                />
                <div
                    data-aos="fade-left"
                    style={{
                        backgroundColor: "rgb(249,250,251)",
                        padding: "2em",
                    }}
                    className="w-50 auth-content"
                >
                    <div
                        style={{ width: "450px" }}
                        className="bg-white mx-auto py-5 px-4 shadow-sm rounded-3 auth-form-card"
                    >
                        <h4 className="fw-semibold">Verify Your Email</h4>
                        <p className="text-secondary">
                            We've sent a verification code to<br />
                            <strong>{email}</strong>
                        </p>

                        <form data-aos="fade-up" onSubmit={handleVerifyEmail}>
                            <div className="form-group mb-3">
                                <label htmlFor="verificationCode">
                                    Verification Code
                                </label>
                                <input
                                    className={`form-control shadow-none border-2 m-0 ${
                                        verificationCode
                                            ? errorMsg
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    name="verificationCode"
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value.toUpperCase())
                                    }
                                    maxLength="6"
                                />
                                {errorMsg && (
                                    <small className="text-danger mb-3">
                                        {errorMsg}
                                    </small>
                                )}
                                {successMsg && (
                                    <small className="text-success mb-3">
                                        {successMsg}
                                    </small>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !verificationCode}
                                style={{
                                    backgroundColor: "rgb(226,131,8)",
                                }}
                                className="btn w-100 py-2 text-white fw-semibold my-3"
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </button>
                        </form>

                        <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
                            <p className="m-0 text-secondary small">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                disabled={resendLoading || resendCountdown > 0}
                                className="btn btn-link p-0 text-decoration-none fw-semibold"
                                style={{ color: "rgb(226,131,8)" }}
                                onClick={handleResendCode}
                            >
                                {resendLoading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Resending...
                                    </>
                                ) : (
                                    "Resend Code"
                                )}
                            </button>
                        </div>

                        {resendCountdown > 0 && (
                            <div className="text-center mt-2">
                                <small className="text-muted">
                                    Wait {resendCountdown}s before requesting another OTP
                                </small>
                            </div>
                        )}

                        <div className="mt-4 pt-3 border-top text-center">
                            <p className="text-secondary small mb-3">
                                Already verified?
                            </p>
                            <button
                                type="button"
                                className="btn border border-2 fw-semibold w-100 py-2"
                                style={{ borderColor: "rgb(226,131,8)", color: "rgb(226,131,8)" }}
                                onClick={() => navigate("/signin")}
                            >
                                Continue to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content border-0 shadow rounded-4">
                                <div className="modal-body p-4 text-center">
                                    <div
                                        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: "56px",
                                            height: "56px",
                                            backgroundColor: "rgba(25,135,84,.12)",
                                        }}
                                    >
                                        <i className="bi bi-check2-circle text-success fs-3"></i>
                                    </div>
                                    <h5 className="fw-semibold mb-2">
                                        Email Verified Successfully
                                    </h5>
                                    <p className="text-secondary mb-4">
                                        Your email has been verified. You can now sign in to your account.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn text-white fw-semibold px-4"
                                        style={{ backgroundColor: "rgb(226,131,8)" }}
                                        onClick={handleContinueToSignIn}
                                    >
                                        Continue to Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default EmailVerification;
