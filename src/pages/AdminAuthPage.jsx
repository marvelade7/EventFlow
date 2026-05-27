import React, { useState } from "react";
import AdminAuthLeftPanel from "../components/AdminAuthLeftPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAuthPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const adminSignin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // For demonstration, using hardcoded credentials. In production, use a secure authentication method.
        axios
            .post(
                "https://eventflow-backend-fwv4.onrender.com/api/admin/login",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )
            .then((res) => {
                setLoading(false);
                // console.log(res.data);
                localStorage.setItem("adminToken", res.data.token);
                navigate("/admin/dashboard");
            })
            .catch((err) => {
                setLoading(false);
                setError(
                    err.response?.data?.message ||
                        "Authentication failed. Please check your credentials.",
                );
            });
    };

    return (
        <div className="d-flex align-items-stretch admin-auth-page">
            <AdminAuthLeftPanel />
            <div
                className="w-50 admin-auth-content"
                style={{ backgroundColor: "rgb(249,250,251)", padding: "2em" }}
            >
                <div
                    className="bg-white rounded-4 py-4 px-4 shadow-sm admin-auth-card"
                    style={{ width: "450px", margin: "80px auto" }}
                >
                    <div className="mb-4">
                        <h5 className="m-0 mb-1 fw-semibold">Admin Portal</h5>
                        <p
                            style={{ fontSize: ".9em" }}
                            className="m-0 text-secondary"
                        >
                            Restricted Access
                        </p>
                    </div>
                    <form onSubmit={adminSignin}>
                        <div className="form-group">
                            <label htmlFor="adminEmail">Admin Email</label>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                id="adminEmail"
                                name="adminEmail"
                                className="form-control shadow-none admin-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="adminPassword">Password</label>
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
                        {error && (
                            <div
                                className="text-danger text-center fw-medium mt-3"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ background: "rgb(49,46,129)" }}
                            className="btn py-2 px-3 rounded-3 text-white w-100 mt-3 fw-semibold"
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In to Dashboard"
                            )}
                        </button>
                        <div
                            style={{ fontSize: ".9em" }}
                            className="d-flex align-items-center gap-2 alert alert-secondary p-3 w-100 border rounded-3 mt-4 m-0"
                        >
                            <i className="bi bi-exclamation-triangle"></i>
                            <p className="m-0">
                                This portal is for authorized administrators
                                only. All access is logged and monitored.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAuthPage;
