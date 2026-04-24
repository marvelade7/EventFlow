import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import UserDashboard from "./pages/UserDashboard";
import CreateNewEventPage from "./pages/CreateNewEventPage";
import Error404 from "./pages/Error404";
import AdminAuthPage from "./pages/AdminAuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import MyEvent from "./pages/MyEvent";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
};

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<Navigate to="/signin" replace />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/dashboard" element={<UserDashboard />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="my-event" element={<MyEvent/>} />
                    <Route path="create-event" element={<CreateNewEventPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                </Route>

                <Route path="/admin-auth" element={<AdminAuthPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </>
    );
};

export default App;
