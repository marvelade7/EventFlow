import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateEventNav from "../components/CreateEventNav";

const BrowseEventPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="create-event-page">
            <Sidebar mobileOpen={sidebarOpen} />
            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div
                className="create-event-main"
                style={{ marginLeft: "300px", background: "rgb(249,250,251)" }}
            >
                <CreateEventNav
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                    title="Browse Events"
                    actionLabel=""
                />
            </div>
        </div>
    );
};

export default BrowseEventPage;
