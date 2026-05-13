import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { fetchBookings } from "../utils/eventsApi";

const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(amount || 0);

const formatBookedDateTime = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatTicketCode = (ticketCode) => {
    return (ticketCode || "").toString().trim();
};

const RecentBookings = ({ scope = "user" }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedQrCode, setSelectedQrCode] = useState(null);
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);
    const [qrGenerationError, setQrGenerationError] = useState("");

    const handleDownloadQr = (qrDataUrl, ticketCode) => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = `ticket-${ticketCode || "qr"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openQrCode = (booking) => {
        const ticketCode = (
            booking?.ticketCode ||
            booking?.reference ||
            booking?.paymentReference ||
            booking?._id ||
            ""
        )
            .toString()
            .trim();

        if (!ticketCode) {
            return;
        }

        const checkInUrl = formatTicketCode(ticketCode);
        setQrGenerationError("");
        setIsGeneratingQr(Boolean(checkInUrl));
        setSelectedQrCode({
            qrDataUrl: "",
            checkInUrl,
            ticketCode,
            userName: booking.userName,
            userEmail: booking.userEmail,
            eventTitle: booking.eventTitle,
            checkedIn: booking.checkedIn,
        });

        if (!checkInUrl) {
            setIsGeneratingQr(false);
            return;
        }

        QRCode.toDataURL(checkInUrl, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 320,
        })
            .then((qrDataUrl) => {
                setSelectedQrCode((current) => {
                    if (!current || current.ticketCode !== ticketCode) {
                        return current;
                    }

                    return {
                        ...current,
                        qrDataUrl,
                    };
                });
            })
            .catch((error) => {
                console.error("Unable to generate QR code", error);
                setQrGenerationError(
                    "Unable to generate the ticket QR code right now.",
                );
            })
            .finally(() => {
                setIsGeneratingQr(false);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("Sign in to view your bookings.");
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        let isActive = true;

        fetchBookings({ token, signal: controller.signal, scope })
            .then((data) => {
                if (!isActive) return;
                setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
            })
            .catch((error) => {
                if (!isActive) return;
                setErrorMessage(
                    error.response?.data?.message ||
                        (scope === "organizer"
                            ? "Unable to load your event bookings right now."
                            : "Unable to load your bookings right now."),
                );
            })
            .finally(() => {
                if (!isActive) return;
                setIsLoading(false);
            });

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [scope]);

    const groupedBookings = useMemo(() => {
        const groups = new Map();

        bookings.forEach((booking) => {
            const event = booking?.event || {};
            const ticketTypes = Array.isArray(event?.ticketTypes)
                ? event.ticketTypes
                : [];
            const unitPrice = Number(
                ticketTypes.find(
                    (ticket) => ticket?.name === booking?.ticketTypeName,
                )?.ticketPrice || 0,
            );
            const groupKey =
                booking?.paymentReference ||
                booking?.ticketCode ||
                booking?._id;
            const existing = groups.get(groupKey);

            if (existing) {
                existing.ticketCount += 1;
                existing.amount += unitPrice;
                return;
            }

            // Extract user details
            const userName =
                booking?.user?.firstName || booking?.user?.name || "User";
            const userLastName = booking?.user?.lastName || "";
            const fullUserName = `${userName}${userLastName ? ` ${userLastName}` : ""}`;
            const userEmail = booking?.user?.email || "N/A";

            groups.set(groupKey, {
                id: groupKey,
                eventTitle: event?.title || "Event",
                date: event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleDateString(
                          "en-US",
                          {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          },
                      )
                    : "Date TBD",
                ticketCount: 1,
                amount: unitPrice,
                status:
                    booking?.paymentStatus === "paid" ? "Confirmed" : "Pending",
                ticketCode: booking?.ticketCode || "",
                reference:
                    booking?.reference || booking?.paymentReference || "",
                qrCode: booking?.qrCode || null,
                createdAt: formatBookedDateTime(booking?.createdAt),
                userName: fullUserName,
                userEmail: userEmail,
                checkedIn: booking?.status === "checked-in" ? "Yes" : "No",

                eventDate: event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleDateString(
                          "en-US",
                          {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                          },
                      )
                    : "Date TBD",

                eventTime: event?.startDateTime
                    ? new Date(event.startDateTime).toLocaleTimeString(
                          "en-US",
                          {
                              hour: "numeric",
                              minute: "2-digit",
                          },
                      )
                    : "Time TBD",

                eventLocation:
                    event?.location || event?.venue || "Venue not specified",
            });
        });

        return Array.from(groups.values());
    }, [bookings]);

    const handleCopyTicketCode = (ticketCode) => {
        if (!ticketCode || !navigator.clipboard) return;

        navigator.clipboard.writeText(ticketCode).catch((error) => {
            console.error("Unable to copy ticket code", error);
        });
    };

    return (
        <div className="table-responsive border rounded-3 mt-4 recent-bookings-wrap bg-white">
            {isLoading ? (
                <div className="py-5 text-center">
                    <div
                        className="spinner-border text-info"
                        role="status"
                        aria-hidden="true"
                    ></div>
                    <p className="mt-3 mb-0 text-secondary fw-semibold">
                        Loading{" "}
                        {scope === "organizer"
                            ? "event bookings"
                            : "your bookings"}
                        ...
                    </p>
                </div>
            ) : errorMessage ? (
                <div className="alert alert-warning m-3 mb-0" role="alert">
                    {errorMessage}
                </div>
            ) : groupedBookings.length === 0 ? (
                <div className="py-5 text-center">
                    <h6 className="mb-1">
                        {scope === "organizer"
                            ? "No event bookings yet"
                            : "No bookings yet"}
                    </h6>
                    <p className="text-secondary mb-0">
                        {scope === "organizer"
                            ? "Bookings for your events will appear here."
                            : "Book an event to see your tickets here."}
                    </p>
                </div>
            ) : (
                <table className="table mb-0 recent-bookings-table align-middle">
                    <thead>
                        <tr className="table-secondary thead">
                            <th>EVENT</th>
                            <th>DATE</th>
                            <th>TICKETS</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                            <th>TICKET CODE</th>
                            <th>QR CODE</th>
                            <th>DATE BOOKED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedBookings.map((booking) => (
                            <tr className="tbody" key={booking.id}>
                                <td>{booking.eventTitle}</td>
                                <td>{booking.date}</td>
                                <td>{booking.ticketCount}</td>
                                <td>{formatMoney(booking.amount)}</td>
                                <td>
                                    {booking.status === "Confirmed" ? (
                                        <p className="m-0 text-success border border-success rounded-4 px-3">
                                            Confirmed
                                        </p>
                                    ) : (
                                        <p className="m-0 border border-warning rounded-4 px-3 text-warning">
                                            Pending
                                        </p>
                                    )}
                                </td>
                                <td className="d-flex align-items-center gap-2">
                                    <p className="m-0">{booking.ticketCode}</p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopyTicketCode(
                                                booking.ticketCode,
                                            )
                                        }
                                        className="btn btn-sm btn-outline-dark"
                                        disabled={!booking.ticketCode}
                                    >
                                        {booking.ticketCode
                                            ? "Copy"
                                            : "No Code"}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => openQrCode(booking)}
                                        className="btn btn-sm btn-outline-info"
                                        title="View QR Code"
                                        disabled={
                                            !booking.ticketCode &&
                                            !booking.reference &&
                                            !booking.paymentReference &&
                                            !booking._id
                                        }
                                    >
                                        View QR Code
                                    </button>
                                </td>
                                <td>{booking.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedQrCode && (
                <div
                    className="modal d-block"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                    }}
                    onClick={() => setSelectedQrCode(null)}
                >
                    <div
                        className="modal-content bg-white rounded-4 p-4"
                        style={{
                            maxWidth: "400px",
                            width: "90%",
                            textAlign: "center",
                            margin: "50px auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="m-0">Ticket QR Code</h5>
                            <button
                                type="button"
                                className="btn btn-close"
                                onClick={() => setSelectedQrCode(null)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-3">
                            {isGeneratingQr && !selectedQrCode.qrDataUrl ? (
                                <div className="py-5 text-center w-100">
                                    <div
                                        className="spinner-border text-info"
                                        role="status"
                                        aria-hidden="true"
                                    ></div>
                                    <p className="mt-3 mb-0 text-secondary fw-semibold">
                                        Generating QR code...
                                    </p>
                                </div>
                            ) : (
                                <img
                                    src={selectedQrCode.qrDataUrl}
                                    alt="QR Code"
                                    style={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        marginBottom: "16px",
                                    }}
                                />
                            )}
                        </div>
                        {qrGenerationError && (
                            <div
                                className="alert alert-warning text-start"
                                role="alert"
                            >
                                {qrGenerationError}
                            </div>
                        )}
                        <p className="mb-2">
                            <strong>Ticket Code:</strong>{" "}
                            {selectedQrCode.ticketCode}
                        </p>
                        <p className="text-secondary mb-3 fs-6">
                            Scan this code to verify your ticket at the event
                            entrance.
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-info flex-grow-1"
                                onClick={() =>
                                    handleDownloadQr(
                                        selectedQrCode.qrDataUrl,
                                        selectedQrCode.ticketCode,
                                    )
                                }
                                disabled={!selectedQrCode.qrDataUrl}
                            >
                                Download QR
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSelectedQrCode(null);
                                    setQrGenerationError("");
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* {selectedQrCode && (
                <div
                    className="ticket-modal-backdrop"
                    onClick={() => setSelectedQrCode(null)}
                >
                    <div
                        className="ticket-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="ticket-modal-close"
                            onClick={() => setSelectedQrCode(null)}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div className="ticket-card-ui">
                            <div className="ticket-card-top">
                                <div>
                                    <span className="ticket-badge">
                                        EVENTFLOW PASS
                                    </span>

                                    <h2 className="ticket-event-title">
                                        {selectedQrCode.eventTitle}
                                    </h2>

                                    <p className="ticket-event-subtitle">
                                        Admit One
                                    </p>
                                </div>

                                <div className="ticket-status-dot"></div>
                            </div>

                            <div className="ticket-divider"></div>

                            <div className="ticket-details-grid">
                                <div>
                                    <span>Attendee</span>
                                    <p>{selectedQrCode.userName}</p>
                                </div>

                                <div>
                                    <span>Email</span>
                                    <p>{selectedQrCode.userEmail}</p>
                                </div>

                                <div>
                                    <span>Date</span>
                                    <p>
                                        {selectedQrCode.eventDate ||
                                            "May 24, 2026"}
                                    </p>
                                </div>

                                <div>
                                    <span>Time</span>
                                    <p>
                                        {selectedQrCode.eventTime || "4:00 PM"}
                                    </p>
                                </div>

                                <div className="ticket-location">
                                    <span>Location</span>
                                    <p>
                                        {selectedQrCode.eventLocation ||
                                            "Eko Convention Center"}
                                    </p>
                                </div>
                            </div>

                            <div className="ticket-qr-wrap">
                                {isGeneratingQr && !selectedQrCode.qrDataUrl ? (
                                    <div className="py-5 text-center">
                                        <div
                                            className="spinner-border text-info"
                                            role="status"
                                        ></div>

                                        <p className="mt-3 text-light">
                                            Generating ticket...
                                        </p>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedQrCode.qrDataUrl}
                                        alt="QR Code"
                                        className="ticket-qr-image"
                                    />
                                )}
                            </div>

                            <div className="ticket-footer">
                                <div>
                                    <span>Ticket Code</span>

                                    <h3>{selectedQrCode.ticketCode}</h3>
                                </div>

                                <button
                                    type="button"
                                    className="ticket-download-btn"
                                    onClick={() =>
                                        handleDownloadQr(
                                            selectedQrCode.qrDataUrl,
                                            selectedQrCode.ticketCode,
                                        )
                                    }
                                    disabled={!selectedQrCode.qrDataUrl}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default RecentBookings;
