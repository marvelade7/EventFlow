import React, { useState } from "react";
import LeftPanel from "../components/LeftPanel";
import { Link } from "react-router-dom";
import googleIcon from "../assets/images/google-icon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false)

    const signin = (e) => {
        e.preventDefault();
        const credentials = { email, password };
        setLoading(true)
        axios
            .post("https://eventflow-backend-fwv4.onrender.com/api/login", credentials)
            .then((response) => {
                setLoading(false)
                setErrorMsg("");
                // alert("Login successful");
                console.log(response.data.user.firstName);
                navigate("/dashboard");
            })
            .catch((error) => {
                setLoading(false)
                setErrorMsg(
                    error.response?.data?.message || "Something went wrong",
                );
                console.error("Error logging in:", error);
                // alert("Login failed");
            });
    };

    return (
        <div className="d-flex align-items-stretch h-100 auth-layout auth-page">
            <LeftPanel
                style="fs-1 mt-5"
                head="Welcome Back"
                pStyle="fs-5"
                p="Access your exclusive dashboard, mange your premium tickets and explore the next wave of editorial experiences"
                // p='Your next great experience is waiting for you.'
            />
            <div
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
                    <h4 className="fw-semibold">Welcome Back</h4>
                    <p className="text-secondary">
                        Sign in to your EventFlow account
                    </p>
                    <form action="" method="post">
                        <div className="mb-3">
                            <label htmlFor="email">Email Address</label>
                            <input
                                className="form-control shadow-none border-2 m-0"
                                type="email"
                                placeholder="alex@example.com"
                                name="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-start mt-4">
                                <label htmlFor="password">Password</label>
                                <p
                                    style={{ fontSize: ".9em" }}
                                    className="m-0 text-primary fw-semibold text-decoration-underline"
                                >
                                    Forgot Password?
                                </p>
                            </div>
                            <div className="input-group border rounded overflow-hidden">
                                <input
                                    className="form-control shadow-none m-0 border-0"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    id="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                        </div>

                        {errorMsg && (
                            <div className="fw-semibold text-danger text-center mt-3">
                                {errorMsg}
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                signin(e);
                            }}
                            style={{ backgroundColor: "rgb(226,131,8)" }}
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
                                    "Sign In"
                                )}
                        </button>
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <hr className="w-50" />
                            <p style={{ fontSize: ".9em" }} className="m-0">
                                or
                            </p>
                            <hr className="w-50" />
                        </div>

                        <button
                            type="button"
                            className="btn d-flex align-items-center justify-content-center gap-3 rounded-3 border p-3 my-3 w-100"
                        >
                            <img src={googleIcon} width="30" />
                            <p className="m-0">Continue with Google</p>
                        </button>

                        <p className="m-0 text-center">
                            Don't have an account?{" "}
                            <Link to="/signup">
                                <span className="text-primary fw-semibold">
                                    Sign Up
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
