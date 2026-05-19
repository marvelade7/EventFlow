import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { fetchBookings } from "../utils/eventsApi";
import Logo from "./Logo";

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

const formatTicketCode = (ticketCode) => (ticketCode || "").toString().trim();

// ──Ticket Modal ─────────────────────────────────────────────────────────
const TicketModal = ({ ticket, onClose }) => {
    const ticketRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!ticketRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `ticket-${ticket.ticketCode}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(6px, 2vw, 16px)",
                overflowY: "auto",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "100%", maxWidth: "min(890px, 98vw)" }}
            >
                <div className="bg-white rounded-3 py-4 px-4">
                    {/* ── Ticket Card ── */}
                    <div
                        ref={ticketRef}
                        style={{
                            background: "rgb(255,255,255)",
                            borderRadius: "12px",
                            border: "0.5px solid #e0e0e0",
                            overflow: "hidden",
                            fontFamily: "'Roboto', 'Segoe UI', sans-serif",
                        }}
                    >
                        {/* Top section */}
                        <div
                            style={{
                                padding:
                                    "clamp(10px, 2.2vw, 20px) clamp(10px, 3.8vw, 36px) 0",
                            }}
                        >
                            {/* Header row */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "14px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "clamp(10px, 1.7vw, 16px)",
                                        color: "#666",
                                    }}
                                >
                                    This is your ticket, {ticket.userName}
                                </p>
                                {/* logo */}
                                <Logo size={30} fontSize="18px" />
                            </div>
                        </div>

                        {/* Dashed divider with notches */}
                        <div style={{ position: "relative", height: "1px" }}>
                            <div
                                style={{
                                    borderTop: "1.5px dashed #d8d8d8",
                                    position: "absolute",
                                    left: 14,
                                    right: 14,
                                    top: 0,
                                }}
                            />
                        </div>

                        {/* Body: info + QR */}
                        <div style={{ display: "flex" }}>
                            {/* Left info */}

                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding:
                                        "clamp(10px, 2.2vw, 20px) clamp(10px, 3.8vw, 36px)",
                                }}
                            >
                                {/* Organiser */}
                                <p
                                    style={{
                                        margin: "0 0 4px",
                                        fontSize: "clamp(10px, 1.5vw, 15px)",
                                        color: "#888",
                                    }}
                                >
                                    {" "}
                                    <span className="fw-semibold">Host: </span>
                                    {ticket.organizerName || "EventFlow"}
                                </p>

                                {/* Event title */}
                                <h2
                                    style={{
                                        margin: "0 0 10px",
                                        fontSize: "clamp(14px, 2.4vw, 24px)",
                                        fontWeight: 700,
                                        color: "#202124",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {ticket.eventTitle}
                                </h2>

                                {/* Venue */}
                                <p
                                    style={{
                                        margin: "0 0 3px",
                                        fontSize: "clamp(10px, 1.4vw, 14px)",
                                        // width: "70%",
                                        color: "#555",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {ticket.eventLocation}
                                </p>

                                {/* Date + Time */}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "clamp(10px, 1.4vw, 14px)",
                                        fontWeight: 600,
                                        color: "#202124",
                                    }}
                                >
                                    {ticket.eventDate}
                                    {ticket.eventTime
                                        ? `, ${ticket.eventTime}`
                                        : ""}
                                </p>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "clamp(8px, 1.8vw, 16px) clamp(8px, 1.4vw, 12px)",
                                        marginTop: "clamp(12px, 2vw, 20px)",
                                    }}
                                >
                                    <InfoField
                                        label="Attendee"
                                        value={ticket.userName}
                                    />
                                    <InfoField
                                        label="Ticket Type"
                                        value={
                                            ticket.ticketTypeName ||
                                            "General Admission"
                                        }
                                    />
                                    <InfoField
                                        label="Ticket Code"
                                        value={ticket.ticketCode}
                                        mono
                                    />
                                    <InfoField
                                        label="Status"
                                        value={ticket.status}
                                        accent={
                                            ticket.status === "Confirmed"
                                                ? "#34A853"
                                                : "#F9A825"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right QR */}
                            <div
                                style={{
                                    width: "auto",
                                    borderLeft: "1.5px dashed #d8d8d8",
                                    background: "#fafafa",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0px clamp(8px, 1.8vw, 16px)",
                                    gap: "clamp(4px, 1vw, 8px)",
                                    flexShrink: 0,
                                }}
                            >
                                {ticket.qrDataUrl ? (
                                    <img
                                        src={ticket.qrDataUrl}
                                        alt="QR Code"
                                        style={{
                                            width: "clamp(85px, 25vw, 300px)",
                                            height: "clamp(85px, 25vw, 300px)",
                                            borderRadius: "4px",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 110,
                                            height: 110,
                                            background: "#eee",
                                            borderRadius: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 11,
                                            color: "#aaa",
                                        }}
                                    >
                                        Loading…
                                    </div>
                                )}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "clamp(9px, 1.2vw, 12px)",
                                        color: "#999",
                                        textAlign: "center",
                                        letterSpacing: "0.3px",
                                    }}
                                >
                                    Scan to check in
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                background: "#f8f9fa",
                                borderTop: "0.5px solid #e0e0e0",
                                padding: "clamp(7px, 1.2vw, 9px) clamp(10px, 2.4vw, 24px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "clamp(9px, 1.3vw, 13px)",
                                    color: "#bbb",
                                }}
                            >
                                © {new Date().getFullYear()} EventFlow · All
                                Rights Reserved.
                            </span>
                        </div>
                    </div>

                    {/* ── Action buttons ── */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "24px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={isDownloading || !ticket.qrDataUrl}
                            className="btn btn-info flex-grow-1 text-white fw-semibold"
                        >
                            {isDownloading ? "Downloading…" : "Download Ticket"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value, mono, accent }) => (
    <div>
        <p
            style={{
                margin: "0 0 2px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
            }}
        >
            {label}
        </p>
        <p
            style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 500,
                color: accent || "#202124",
                fontFamily: mono ? "monospace" : "inherit",
                wordBreak: "break-all",
            }}
        >
            {value || "—"}
        </p>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const RecentBookings = ({ scope = "user" }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);

    const openTicket = (booking) => {
        const ticketCode = formatTicketCode(
            booking?.ticketCode ||
                booking?.reference ||
                booking?.paymentReference ||
                booking?._id ||
                "",
        );

        if (!ticketCode) return;

        setSelectedTicket({
            qrDataUrl: "",
            ticketCode,
            userName: booking.userName,
            userEmail: booking.userEmail,
            eventTitle: booking.eventTitle,
            eventDate: booking.eventDate,
            eventTime: booking.eventTime,
            eventLocation: booking.eventLocation,
            organizerName: booking.organizerName,
            ticketTypeName: booking.ticketTypeName,
            status: booking.status,
            ticketCount: booking.ticketCount,
        });

        setIsGeneratingQr(true);

        QRCode.toDataURL(ticketCode, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 320,
        })
            .then((qrDataUrl) => {
                setSelectedTicket((prev) =>
                    prev?.ticketCode === ticketCode
                        ? { ...prev, qrDataUrl }
                        : prev,
                );
            })
            .catch((err) => console.error("QR generation failed", err))
            .finally(() => setIsGeneratingQr(false));
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
                ticketTypes.find((t) => t?.name === booking?.ticketTypeName)
                    ?.ticketPrice || 0,
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

            const userName =
                booking?.user?.firstName || booking?.user?.name || "User";
            const userLastName = booking?.user?.lastName || "";
            const fullUserName = `${userName}${userLastName ? ` ${userLastName}` : ""}`;

            // Organiser name
            const createdBy = event?.createdBy || {};
            const organizerFirst =
                createdBy?.firstName || createdBy?.name || "";
            const organizerLast = createdBy?.lastName || "";
            const organizerName =
                `${organizerFirst}${organizerLast ? ` ${organizerLast}` : ""}`.trim() ||
                "Google Developer Groups";

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
                createdAt: formatBookedDateTime(booking?.createdAt),
                userName: fullUserName,
                userEmail: booking?.user?.email || "N/A",
                checkedIn: booking?.status === "checked-in" ? "Yes" : "No",
                ticketTypeName: booking?.ticketTypeName || "General Admission",
                organizerName,
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
                    : "",
                // eventLocation: event?.location || event?.venue || "Venue not specified",
                eventLocation: (() => {
                    const loc = event?.location;
                    if (!loc) return event?.venue || "Venue not specified";
                    if (typeof loc === "string") return loc;
                    const { venue, address, city, state, country } = loc;
                    return [venue, address, city, state, country]
                        .filter(Boolean)
                        .join(", ");
                })(),
            });
        });

        return Array.from(groups.values());
    }, [bookings]);

    const handleCopyTicketCode = (ticketCode) => {
        if (!ticketCode || !navigator.clipboard) return;
        navigator.clipboard
            .writeText(ticketCode)
            .catch((err) => console.error("Copy failed", err));
    };

    return (
        <div className="table-responsive border rounded-3 mt-4 recent-bookings-wrap bg-white">
            {isLoading ? (
                <div className="py-5 text-center">
                    <div
                        className="spinner-border text-info"
                        role="status"
                        aria-hidden="true"
                    />
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
                            <th>TICKET</th>
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
                                        onClick={() => openTicket(booking)}
                                        className="btn btn-sm btn-outline-info"
                                        disabled={!booking.ticketCode}
                                    >
                                        View Ticket
                                    </button>
                                </td>
                                <td>{booking.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};

export default RecentBookings;
