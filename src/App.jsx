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
import MyTicketPage from "./pages/MyTicketPage";
import BrowseEventPage from "./pages/BrowseEventPage";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
};

import { ProfileProvider } from "./context/ProfileContext";

const App = () => {
    const token = localStorage.getItem("token");
    return (
        <>
            <ScrollToTop />
            <ProfileProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/login" element={<Navigate to="/signin" replace />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/dashboard" element={token ? <UserDashboard /> : <Navigate to="/signin" replace />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="my-event" element={<MyEvent />} />
                    <Route path="create-event" element={<CreateNewEventPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="tickets" element={<MyTicketPage />} />
                    <Route path="browse-event" element={<BrowseEventPage />} />
                </Route>

                <Route path="/admin-auth" element={<AdminAuthPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
            </ProfileProvider>
        </>
    );
};

export default App;
