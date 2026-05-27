import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import AdminOverview from "../components/AdminOverview";
import AdminManageEvents from "../components/AdminManageEvents";
import AdminManageUsers from "../components/AdminManageUsers";
import AdminModeratePosts from "../components/AdminModeratePosts";
import AdminPlatformControl from "../components/AdminPlatformControl";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [statsData, setStatsData] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [activityLog, setActivityLog] = useState([
        "Published spotlight banner for Lagos Sound Summit.",
        "Suspended one organizer account for policy review.",
        "Removed 1 reported promotional post from the feed.",
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });

        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            navigate("/admin/login");
            return;
        }

        axios
            .get(apiUrl("/admin/stats"), {
                headers: { Authorization: `Bearer ${adminToken}` },
            })
            .then((res) => {
                const data = res.data || {};
                setStatsData(data);
                setRecentBookings(data.recentBookings || []);
            })
            .catch((err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin/login");
                    return;
                }

                console.warn("Failed to load admin stats:", err.message || err);
            });
    }, [navigate]);

    const stats = useMemo(
        () => [
            {
                title: "Total Users",
                value: statsData?.totalUsers ?? 0,
                meta: "People on EventFlow",
                icon: "bi bi-people",
                accent: "cyan",
            },
            {
                title: "Total Events",
                value: statsData?.totalEvents ?? 0,
                meta: "Events in the system",
                icon: "bi bi-calendar2-event",
                accent: "orange",
            },
            {
                title: "Total Bookings",
                value: statsData?.totalBookings ?? 0,
                meta: "Bookings across the platform",
                icon: "bi bi-ticket-perforated",
                accent: "danger",
            },
            {
                title: "Total Revenue",
                value: statsData?.totalRevenue ?? 0,
                meta: "Reported revenue",
                icon: "bi bi-currency-dollar",
                accent: "purple",
            },
        ],
        [statsData],
    );

    const addActivity = (message) => {
        setActivityLog((prev) => [message, ...prev].slice(0, 6));
    };

    const sectionMap = {
        overview: (
            <AdminOverview
                stats={stats}
                recentBookings={recentBookings}
                activityLog={activityLog}
            />
        ),
        events: <AdminManageEvents searchTerm={searchTerm} onActivity={addActivity} />,
        users: <AdminManageUsers searchTerm={searchTerm} onActivity={addActivity} />,
        posts: <AdminModeratePosts searchTerm={searchTerm} onActivity={addActivity} />,
        controls: <AdminPlatformControl onActivity={addActivity} />,
    };

    return (
        <div className="admin-dashboard-page">
            <AdminSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                mobileOpen={sidebarOpen}
            />
            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className="admin-dashboard-main">
                <AdminTopbar
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <div className="admin-dashboard-content">{sectionMap[activeSection]}</div>
            </div>
        </div>
    );
};

export default AdminDashboard;
