import React from "react";

const LivePreview = () => {
    const preview = {
        position: "sticky",
        top: "10px",
    };
    return (
        <div style={preview}>
            <div className="bg-white rounded-4 p-3 shadow-sm mb-4">
                <h6
                    style={{ fontSize: ".9em" }}
                    className="text-secondary mb-3"
                >
                    LIVE PREVIEW
                </h6>
                <div>
                    <img
                        className="preview-img"
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=140&fit=crop"
                    />
                    <p className="mt-3 px-3 border d-inline-flex rounded-4">
                        Music
                    </p>
                    <h6 style={{ fontSize: "1.1em" }}>Your Event Name</h6>
                    <p className="m-0">Date TBD</p>
                    <p className="m-0">Venue TBD</p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                    <p
                        style={{ color: "rgb(17,213,243)" }}
                        className="fw-semibold m-0"
                    >
                        $0.00
                    </p>
                    <button
                        style={{ backgroundColor: "rgb(17,213,243)" }}
                        className="btn py-1 text-white fw-semibold"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            <div style={preview} className="bg-white rounded-4 p-3 shadow-sm">
                <div className="text-secondary">
                    <h6 style={{ fontSize: ".9em" }} className=" mb-3">
                        REQUIRED FIELDS
                    </h6>
                    <ul className="">
                        <li className="m-0">Event Name</li>
                        <li className="m-0">Category</li>
                        <li className="m-0">Description</li>
                        <li className="m-0">Date & Time</li>
                        <li className="m-0">Location</li>
                        <li className="m-0">Ticket Price</li>
                        <li className="m-0">Event Banner</li>
                    </ul>
                </div>
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4 create-event-bottom-actions">
                <button className="btn btn-outline-light w-100 text-dark border rounded-3 py-2 px-3">
                    Save Draft
                </button>
                <button
                    style={{ backgroundColor: "rgb(17,213,243)" }}
                    className="btn rounded-3 text-white w-100 py-2 fw-semibold px-3"
                >
                    Publish Event
                </button>
            </div>
            </div>
        </div>
    );
};

export default LivePreview;
