import React from "react";
import CreateEventNav from "../components/CreateEventNav";
import { useOutletContext } from "react-router-dom";

const MyEvent = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();

    return (
        <div
            className="create-event-main"
            style={{ marginLeft: "300px", background: "rgb(249,250,251)" }}
        >
                <CreateEventNav
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={sidebarOpen}
                    title="My Events"
                    actionLabel=""
                />
        </div>
    );
};

export default MyEvent;
