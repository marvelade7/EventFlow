import React from "react";
import CreateEventNav from "../components/CreateEventNav";
import { useOutletContext } from "react-router-dom";

const BrowseEventPage = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();

    return (
        <div
            className="create-event-main"
            style={{ marginLeft: "300px", background: "rgb(249,250,251)" }}
        >
                <CreateEventNav
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={sidebarOpen}
                    title="Browse Events"
                    actionLabel=""
                />
        </div>
    );
};

export default BrowseEventPage;
