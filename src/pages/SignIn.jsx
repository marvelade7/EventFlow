import React, { useEffect, useState, useContext } from "react";
import LeftPanel from "../components/LeftPanel";
import { Link } from "react-router-dom";
import googleIcon from "../assets/images/google-icon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aos from "aos";
import "aos/dist/aos.css";
import { ProfileContext } from "../context/ProfileContext";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const SignIn = () => {
    useEffect(() => {
        aos.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(ProfileContext);

    const continuePendingBooking = () => {
        const pendingBookingEvent = localStorage.getItem("pendingBookingEvent");

        if (!pendingBookingEvent) {
            navigate("/dashboard", { replace: true });
            return;
        }

        try {
            const event = JSON.parse(pendingBookingEvent);
            localStorage.setItem("checkoutEvent", JSON.stringify(event));
            localStorage.removeItem("pendingBookingEvent");
            navigate("/dashboard/checkout", { state: { event }, replace: true });
        } catch (error) {
            console.error("Invalid pending booking event:", error);
            localStorage.removeItem("pendingBookingEvent");
            navigate("/dashboard", { replace: true });
        }
    };

    const signInWithGoogle = () => {
        if (!auth || !googleProvider) {
            setErrorMsg("Google sign-in is unavailable because Firebase is not configured.");
            return;
        }

        signInWithPopup(auth, googleProvider)
            .then((result) => {
                setUser(result.user);

                return axios
                    .post(
                        "https://eventflow-backend-fwv4.onrender.com/api/users/google-auth",
                        {
                            firstName: result.user.displayName.split(" ")[0],
                            lastName: result.user.displayName.split(" ")[1] || "",
                            email: result.user.email,
                            photoURL: result.user.photoURL,
                        },
                    )
                    .then((res) => {
                        console.log(res.data);
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("userId", res.data.user._id);
                        continuePendingBooking();
                    })
                    .catch((error) => {
                        console.error("Google auth error:", error);
                        setErrorMsg(
                            error.response?.data?.message ||
                                "Google authentication failed. Please try again.",
                        );
                    });
            })
            .catch((error) => {
                console.error("Sign-in error:", error);
            });
    };

    const handleSignOut = () => {
            if (!auth) {
                setUser(null);
                return;
            }

            signOut(auth)
                .then(() => {
                    setUser(null);
                })
                .catch((error) => {
                    console.error("Sign-out error:", error);
                });
        };
    
        useEffect(() => {
            if (!auth) return;

            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
            return () => unsubscribe(); // cleanup on unmount
        }, []);

    const signin = (e) => {
        e.preventDefault();
        if (loading) return;

        const credentials = { email, password };
        setLoading(true);
        setErrorMsg("");

        axios
            .post(
                "https://eventflow-backend-fwv4.onrender.com/api/users/login",
                credentials,
            )
            .then((response) => {
                const token =
                    response.data?.token ||
                    response.data?.accessToken ||
                    response.data?.data?.token;
                const userData =
                    response.data?.user || response.data?.data?.user || {};

                if (token) {
                    // Store user data in context
                    if (setUser) setUser(userData);
                    localStorage.setItem("token", token);
                    if (userData && userData._id) {
                        localStorage.setItem("userId", userData._id);
                    }
                    continuePendingBooking();
                } else {
                    setErrorMsg("Login failed. Please check your credentials.");
                }
                setLoading(false);
            })
            .catch((error) => {
                setErrorMsg(
                    error.response?.data?.message || "Something went wrong",
                );
                setLoading(false);
            });
    };

    return (
        <div className="d-flex align-items-stretch h-100 auth-layout auth-page">
            <LeftPanel
                style="fs-1 mt-5"
                head="Welcome Back"
                pStyle="fs-5"
                p="Access your exclusive dashboard, mange your premium tickets and explore the next wave of editorial experiences"
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
                    <h4 className="fw-semibold">Welcome Back</h4>
                    <p className="text-secondary">
                        Sign in to your EventFlow account
                    </p>
                    <form onSubmit={signin} data-aos="fade-up">
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
                                    <Link to="/forgot-password">
                                        Forgot Password?
                                    </Link>
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
                            type="submit"
                            disabled={loading}
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
                            onClick={signInWithGoogle}
                            className="btn continueWithGoogle d-flex align-items-center justify-content-center gap-3 rounded-3 border p-3 my-3 w-100"
                        >
                            <img src={googleIcon} width="30" />
                            <p className="m-0">Continue with Google</p>
                        </button>

                        <p className="text-center small mt-2 mb-0">
                            By continuing, you agree to our {" "}
                            <Link to="/terms-and-conditions" className="text-primary">Terms</Link> and {" "}
                            <Link to="/privacy-policy" className="text-primary">Privacy Policy</Link>.
                        </p>

                        <p className="m-0 text-center mt-3">
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
