import React, { useEffect, useMemo } from "react";

const LivePreview = ({ values, isSubmitting, onSaveDraft, isPublishDisabled = false }) => {
    const preview = {
        position: "sticky",
        top: "10px",
    };

    const imageUrl = useMemo(
        () => (values.eventBanner ? URL.createObjectURL(values.eventBanner) : ""),
        [values.eventBanner]
    );

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const previewDate = values.startDate ? new Date(values.startDate).toLocaleDateString() : "Date TBD";
    const previewVenue = values.venueName || "Venue TBD";
    const previewName = values.eventName || "Your Event Name";
    const previewCategory = values.category || "Category";
    const previewPrice = values.isFree ? "$0.00" : `$${Number(values.ticketPrice || 0).toFixed(2)}`;

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
                        src={
                            imageUrl ||
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=140&fit=crop"
                        }
                        alt="Event preview"
                    />
                    <p className="mt-3 px-3 border d-inline-flex rounded-4">
                        {previewCategory}
                    </p>
                    <h6 style={{ fontSize: "1.1em" }}>{previewName}</h6>
                    <p className="m-0">{previewDate}</p>
                    <p className="m-0">{previewVenue}</p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                    <p
                        style={{ color: "rgb(17,213,243)" }}
                        className="fw-semibold m-0"
                    >
                        {previewPrice}
                    </p>
                    <button
                        style={{ backgroundColor: "rgb(17,213,243)" }}
                        type="button"
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
                <button type="button" onClick={onSaveDraft} className="btn btn-outline-light w-100 text-dark border rounded-3 py-2 px-3">
                    Save Draft
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isPublishDisabled}
                    style={{ backgroundColor: "rgb(17,213,243)" }}
                    className="btn rounded-3 text-white w-100 py-2 fw-semibold px-3"
                >
                    {isSubmitting ? "Publishing..." : "Publish Event"}
                </button>
            </div>
            </div>
        </div>
    );
};

export default LivePreview;
