import React, { useState, useEffect } from "react";
import LeftPanel from "../components/LeftPanel";
import "../components/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../assets/images/google-icon.png";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import aos from "aos";
import "aos/dist/aos.css";

const SignUp = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        aos.init({ 
            duration: 1000,
            once: true, 
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

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        onSubmit: (values, {resetForm}) => {
            setLoading(true);
            const normalizedEmail = values.email.trim().toLowerCase();
            // console.log(values);
            axios
                .post("https://eventflow-backend-fwv4.onrender.com/api/users/register", {
                    ...values,
                    email: normalizedEmail,
                })
                .then((res) => {
                    setLoading(false);
                    console.log(res.data.user);
                    console.log(res.data.message);
                    setErrorMsg("");
                    resetForm()
                    // Store email in localStorage for verification page
                    localStorage.setItem("verificationEmail", normalizedEmail);
                    showNotification("Registration successful! Please verify your email.", "success");
                    setTimeout(() => {
                        setShowSuccessModal(true);
                    }, 500);
                })
                .catch((err) => {
                    setLoading(false);
                    showNotification(err.response?.data?.message || "Something went wrong", "error");
                });
        },
        validateOnMount: true, // 👈 important
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: yup.object({
            firstName: yup
                .string()
                .trim()
                .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Invalid name format")
                .matches(/^[A-Za-z\s]+$/, "Name cannot contain numbers")
                .min(2, "First name must be at least 2 characters")
                .required("First name is required"),
            lastName: yup
                .string()
                .trim()
                .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Invalid name format")
                .matches(/^[A-Za-z\s]+$/, "Name cannot contain numbers")
                .min(2, "Last name must be at least 2 characters")
                .required("Last name is required"),
            email: yup
                .string()
                .trim()
                .lowercase()
                .email("Invalid email address")
                .required("Email is required"),
            password: yup
                .string()
                .min(6, "Password must be at least 6 characters")
                .matches(/^\S*$/, "Password cannot contain spaces")
                .matches(/[a-z]/, "must contain at least one lowercase letter")
                .matches(/[A-Z]/, "must contain at least one uppercase letter")
                .matches(/[0-9]/, "must contain at least a number")
                .matches(
                    /[!@#$%_-]/,
                    "must contain at least a special character (! @ # $ % _ -)",
                )
                .required("Password is required"),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Confirm Password is required"),
            terms: yup
                .boolean()
                .oneOf([true], "You must accept the terms and conditions"),
        }),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const password = formik.values.password;

    const handleContinueToSignIn = () => {
        setShowSuccessModal(false);
        navigate("/signin");
    };

    const handleVerifyEmail = () => {
        setShowSuccessModal(false);
        const storedEmail = localStorage.getItem("verificationEmail") || formik.values.email;
        navigate(`/verify-email?email=${encodeURIComponent(storedEmail)}`, {
            state: { email: storedEmail },
        });
    };

    const passwordRules = {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@#$%!]/.test(password),
        length: password.length >= 6,
    };

    // const validate = (values) => {
    return (
        <div>
            <div className="d-flex align-items-stretch auth-layout auth-page">
                <LeftPanel
                    head="EventFlow Join the community of event lovers"
                    p="Discover, book, and experience events like never before."
                    texthead="Why Choose EventFlow for your event ticketing?"
                    text1="Simple, easy to use platform"
                    text2="Lowest ticketing fees"
                    text3="Dedicated customer support team"
                    text4="Powerful features"
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
                        <h4 className="fw-semibold">Create Your Account</h4>
                        <p className="text-secondary">
                            Join thousands of event lovers
                        </p>
                        <form
                            data-aos = 'fade-up'
                            action="register"
                            method="post"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="form-group mb-3">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    className={`form-control shadow-none border-2 m-0 ${
                                        formik.touched.firstName
                                            ? formik.errors.firstName
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    type="text"
                                    placeholder="Alex"
                                    name="firstName"
                                    id="firstName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstName}
                                />
                                {formik.touched.firstName &&
                                    formik.errors.firstName && (
                                        <small className="text-danger mb-3">
                                            {formik.errors.firstName}
                                        </small>
                                    )}
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    className={`form-control shadow-none border-2 m-0 ${
                                        formik.touched.lastName
                                            ? formik.errors.lastName
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    type="text"
                                    placeholder="Johnson"
                                    name="lastName"
                                    id="lastName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                />
                                {formik.touched.lastName &&
                                    formik.errors.lastName && (
                                        <small className="text-danger mb-3">
                                            {formik.errors.lastName}
                                        </small>
                                    )}
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    className={`form-control border shadow-none border-2 m-0 ${
                                        formik.touched.email
                                            ? formik.errors.email
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    type="email"
                                    placeholder="alex@example.com"
                                    name="email"
                                    id="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <small className="text-danger mb-3">
                                            {formik.errors.email}
                                        </small>
                                    )}
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>

                                <div
                                    className={`input-group border rounded overflow-hidden ${
                                        formik.touched.password
                                            ? formik.errors.password
                                                ? "border-danger border-2"
                                                : "border-success"
                                            : "border-secondary"
                                    }`}
                                >
                                    <input
                                        className="form-control shadow-none m-0 border-0"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Create a strong password"
                                        name="password"
                                        id="password"
                                        onChange={formik.handleChange}
                                        onBlur={(e) => {
                                            formik.handleBlur(e);
                                            setShowPasswordRules(false);
                                        }}
                                        onFocus={() =>
                                            setShowPasswordRules(true)
                                        }
                                        value={formik.values.password}
                                    />

                                    <span
                                        className="input-group-text bg-white border-0"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i
                                            className={`bi ${
                                                showPassword
                                                    ? "bi-eye-slash"
                                                    : "bi-eye"
                                            }`}
                                        ></i>
                                    </span>
                                </div>

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <small className="text-danger mb-3">
                                            {formik.errors.password}
                                        </small>
                                    )}
                                {showPasswordRules && (
                                    <div className="mt-2 small">
                                        <p
                                            className={
                                                passwordRules.lowercase
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {passwordRules.lowercase ? (
                                                <i className="bi bi-check-circle text-success tick"></i>
                                            ) : (
                                                <i className="bi bi-x-circle"></i>
                                            )}{" "}
                                            At least one lowercase letter
                                        </p>

                                        <p
                                            className={
                                                passwordRules.uppercase
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {passwordRules.uppercase ? (
                                                <i className="bi bi-check-circle text-success tick"></i>
                                            ) : (
                                                <i className="bi bi-x-circle"></i>
                                            )}{" "}
                                            At least one uppercase letter
                                        </p>

                                        <p
                                            className={
                                                passwordRules.number
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {passwordRules.number ? (
                                                <i className="bi bi-check-circle text-success tick"></i>
                                            ) : (
                                                <i className="bi bi-x-circle"></i>
                                            )}{" "}
                                            At least one number
                                        </p>

                                        <p
                                            className={
                                                passwordRules.special
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {passwordRules.special ? (
                                                <i className="bi bi-check-circle text-success tick"></i>
                                            ) : (
                                                <i className="bi bi-x-circle"></i>
                                            )}{" "}
                                            At least one special character (@ #
                                            $ % !)
                                        </p>

                                        <p
                                            className={
                                                passwordRules.length
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {passwordRules.length ? (
                                                <i className="bi bi-check-circle text-success tick"></i>
                                            ) : (
                                                <i className="bi bi-x-circle"></i>
                                            )}{" "}
                                            Minimum 6 characters
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    className={`form-control shadow-none border-2 m-0 ${
                                        formik.touched.confirmPassword
                                            ? formik.errors.confirmPassword
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    type="password"
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                />
                                {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                        <small className="text-danger mb-3">
                                            {formik.errors.confirmPassword}
                                        </small>
                                    )}
                            </div>

                            <div className="d-flex align-items-center justify-content-start gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    id="terms"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.terms}
                                    className={`form-check-input m-0 ${
                                        formik.touched.terms
                                            ? formik.errors.terms
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                />
                                <label htmlFor="terms" className="m-0">
                                    I agree to the{" "}
                                    <span className="text-primary">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="text-primary">
                                        Privacy Policy
                                    </span>
                                </label>
                            </div>
                            {formik.touched.terms && formik.errors.terms && (
                                <small className="text-danger mb-3">
                                    {formik.errors.terms}
                                </small>
                            )}

                            {errorMsg && (
                                <div className="fw-semibold text-danger text-center mt-3">
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
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
                                        Processing...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                            <div className="d-flex align-items-center justify-content-between">
                                <hr className="w-25" />
                                <p style={{ fontSize: ".9em" }} className="m-0">
                                    or continue with
                                </p>
                                <hr className="w-25" />
                            </div>

                            <div className="btn d-flex align-items-center justify-content-center gap-3 rounded-3 border p-3 my-3  ">
                                {/* <i className='bi bi-google'></i> */}
                                <img src={googleIcon} width="30" />
                                <p className="m-0">Continue with Google</p>
                            </div>

                            <p className="m-0 text-center">
                                Already have an account?{" "}
                                <Link to="/signin">
                                    <span className="text-primary fw-semibold">
                                        Sign In
                                    </span>
                                </Link>
                            </p>
                        </form>
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
                                    <h5 className="fw-semibold mb-2">Account Created Successfully</h5>
                                    <p className="text-secondary mb-4">
                                        Your EventFlow account is ready. Would you like to verify your email now?
                                    </p>
                                    <div className="d-flex gap-3 justify-content-center">
                                        <button
                                            type="button"
                                            className="btn text-white fw-semibold px-4"
                                            style={{ backgroundColor: "rgb(226,131,8)" }}
                                            onClick={handleVerifyEmail}
                                        >
                                            Verify Email Now
                                        </button>
                                        <button
                                            type="button"
                                            className="btn border border-2 fw-semibold px-4"
                                            style={{ borderColor: "rgb(226,131,8)", color: "rgb(226,131,8)" }}
                                            onClick={handleContinueToSignIn}
                                        >
                                            Skip to Sign In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

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

export default SignUp;
