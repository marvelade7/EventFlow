import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import CreateEventNav from "../components/CreateEventNav";
import { apiUrl } from "../utils/apiConfig";
import Avatar from "../components/Avatar";
import aos from "aos";
import "aos/dist/aos.css";

const formatMoney = (amount) => {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount || 0));
    } catch (e) {
        return String(amount || 0);
    }
};

const TicketSalesPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { sidebarOpen, toggleSidebar } = useOutletContext() || {};

    const [event, setEvent] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [salesMapState, setSalesMapState] = useState({});
    const [totalSoldState, setTotalSoldState] = useState(0);
    const [totalRevenueState, setTotalRevenueState] = useState(0);
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        aos.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 40 });

        if (!eventId) {
            setError("Missing event id");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                // fetch event details
                const [eventRes, bookingsRes] = await Promise.all([
                    axios.get(apiUrl(`/events/get-events/${eventId}`), { signal: controller.signal }),
                    axios.get(apiUrl(`/bookings/my-event-bookings?eventId=${eventId}`), {
                        signal: controller.signal,
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                ]);

                const evt = eventRes?.data?.event || eventRes?.data || null;
                let bks = Array.isArray(bookingsRes?.data?.bookings)
                    ? bookingsRes.data.bookings
                    : (Array.isArray(bookingsRes?.data) ? bookingsRes.data : []);

                // Filter bookings to only include those for this event (safeguard if backend returns multiple events)
                bks = bks.filter((bk) => {
                    const bkEventId = (bk.event && (bk.event._id || bk.event)) || bk.event;
                    return String(bkEventId) === String(eventId) || String(bk.event) === String(eventId);
                });

                // build ticket price lookup from event data
                const ticketPriceMapLocal = (evt?.ticketTypes || []).reduce((acc, t) => {
                    const n = (t?.name || "General Admission").toString().trim().toLowerCase();
                    acc[n] = Number(t?.ticketPrice ?? t?.price ?? 0);
                    return acc;
                }, {});

                const getBookingAmountLocal = (bk) => {
                    const raw = bk.amountPaid ?? bk.amount ?? 0;
                    const parsed = Number(raw) || 0;
                    if (parsed > 0) return parsed;
                    const key = (bk.ticketTypeName || bk.ticketType || "General Admission").toString().trim().toLowerCase();
                    return ticketPriceMapLocal[key] || 0;
                };

                // aggregate
                const map = {};
                let totalSold = 0;
                let totalRevenue = 0;

                bks.forEach((bk) => {
                    const name = (bk.ticketTypeName || bk.ticketType || "General Admission").toString();
                    const paid = getBookingAmountLocal(bk);
                    if (!map[name]) map[name] = { sold: 0, revenue: 0 };
                    map[name].sold += 1;
                    map[name].revenue += paid;
                    totalSold += 1;
                    totalRevenue += paid;
                });

                const ticketQuantitiesLocal = (evt?.ticketTypes || []).reduce((acc, t) => {
                    const name = (t?.name || "General Admission").toString();
                    acc[name] = Number(t?.quantity || t?.qty || 0);
                    return acc;
                }, {});

                setEvent(evt);
                setBookings(bks);
                setSalesMapState(map);
                setTotalSoldState(totalSold);
                setTotalRevenueState(totalRevenue);
                setTicketQuantities(ticketQuantitiesLocal);
            } catch (err) {
                if (err.name === "CanceledError") return;
                console.error("TicketSales fetch error:", err);
                const status = err.response?.status;
                const serverMessage = err?.response?.data?.message || err?.response?.data || err.message;
                setError(status ? `Error ${status}: ${serverMessage}` : serverMessage || "Failed to load ticket sales");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [eventId]);

    // build ticket price lookup from event data
    const ticketPriceMap = (event?.ticketTypes || []).reduce((acc, t) => {
        const n = (t?.name || "General Admission").toString().trim().toLowerCase();
        acc[n] = Number(t?.ticketPrice ?? t?.price ?? 0);
        return acc;
    }, {});

    const getBookingAmount = (b) => {
        const raw = b.amountPaid ?? b.amount ?? 0;
        const parsed = Number(raw) || 0;
        if (parsed > 0) return parsed;
        const key = (b.ticketTypeName || b.ticketType || "General Admission").toString().trim().toLowerCase();
        return ticketPriceMap[key] || 0;
    };

    // use precomputed state values to ensure spinner waits until derived values are ready
    const salesMap = salesMapState || {};
    const totalSold = totalSoldState;
    const totalRevenue = totalRevenueState;

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="create-event-main" style={{ marginLeft: "300px", background: "#f7f9fb", minHeight: "100vh" }}>
            <CreateEventNav
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={sidebarOpen}
                title={`Ticket Sales`}
                actionLabel={`Back to Events`}
                onActionClick={() => navigate("/dashboard/my-event")}
            />

            <div className="px-4 pb-4 pt-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status" aria-hidden="true"></div>
                        <p className="mt-2 mb-0 text-secondary fw-semibold">Loading ticket sales...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-warning mb-0 d-flex align-items-center gap-2" role="alert">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                ) : (
                    <div>
                        <div className="row gx-4 align-items-center mb-4" data-aos="fade-right">
                            <div className="col-md-3">
                                <div className="bg-white rounded-3 shadow-sm overflow-hidden" style={{height: 160}} data-aos="zoom-in">
                                    {event?.bannerImage ? (
                                        <img src={event.bannerImage} alt="banner" style={{width: '100%', height: '160px', objectFit: 'cover'}} />
                                    ) : (
                                        <div style={{height: '160px', display:'flex', alignItems:'center', justifyContent:'center'}} className="bg-light text-secondary">
                                            <i className="bi bi-camera fs-1"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h4 className="mb-1" data-aos="fade-up">{event?.title || 'Event'}</h4>
                                <div className="text-secondary mb-2" data-aos="fade-up" data-aos-delay="80">{event?.category || ''} • {event?.location?.venue || event?.venue || 'Venue TBD'}</div>
                                <p className="mb-0 text-muted small" data-aos="fade-up" data-aos-delay="120">{event?.description ? event.description.slice(0, 180) + (event.description.length > 180 ? '...' : '') : 'No description'}</p>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex flex-column gap-2">
                                    <div className="p-3 bg-white rounded-3 shadow-sm text-center" data-aos="fade-left">
                                        <div className="text-secondary small">Tickets Sold</div>
                                        <div className="fw-bold fs-4">{totalSold}</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-3 shadow-sm text-center" data-aos="fade-left" data-aos-delay="80">
                                        <div className="text-secondary small">Revenue</div>
                                        <div className="fw-bold fs-4">{formatMoney(totalRevenue)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-4 shadow-sm" data-aos="fade-up">
                            <div className="card-body">
                                <h6 className="mb-3">Sales Breakdown</h6>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Ticket Type</th>
                                                <th>Sold</th>
                                                <th>Capacity</th>
                                                <th>Fill</th>
                                                <th>Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(salesMap).length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-secondary">No sales yet</td>
                                                </tr>
                                            ) : (
                                                Object.entries(salesMap).map(([name, data], i) => {
                                                    const capacity = ticketQuantities[name] || 0;
                                                    const percent = capacity > 0 ? Math.min(100, Math.round((data.sold / capacity) * 100)) : 0;
                                                    return (
                                                        <tr key={name} data-aos="fade-up" data-aos-delay={i * 60}>
                                                            <td className="fw-semibold">{name}</td>
                                                            <td>{data.sold}</td>
                                                            <td>{capacity || '—'}</td>
                                                            <td style={{minWidth: 200}}>
                                                                <div className="progress" style={{height: 8}}>
                                                                    <div className={`progress-bar bg-info`} role="progressbar" style={{width: `${percent}%`}} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>
                                                                </div>
                                                                <small className="text-secondary">{percent}%</small>
                                                            </td>
                                                            <td>{formatMoney(data.revenue)}</td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm" data-aos="fade-up" data-aos-delay="120">
                            <div className="card-body">
                                <h6 className="mb-3">Recent Bookings</h6>
                                {bookings.length === 0 ? (
                                    <div className="text-secondary py-3">No bookings yet</div>
                                ) : (
                                    <div className="list-group">
                                        {bookings.map((b, idx) => (
                                            <div key={b._id || b.id || idx} className="list-group-item d-flex gap-3 align-items-center" data-aos="fade-up" data-aos-delay={idx * 40}>
                                                <div style={{width:48, height:48}}>
                                                    {b.user?.profilePic ? (
                                                        <img src={b.user.profilePic} alt="avatar" className="rounded-circle" style={{width:48, height:48, objectFit:'cover'}} />
                                                    ) : (
                                                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width:48, height:48}}>{getInitials(b.user?.firstName ? `${b.user.firstName} ${b.user.lastName || ''}` : b.purchaserName || b.user?.email)}</div>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <div className="fw-semibold">{b.user?.firstName ? `${b.user.firstName} ${b.user.lastName || ''}` : b.user?.email || b.purchaserName || 'Buyer'}</div>
                                                            <small className="text-secondary">{b.ticketTypeName || b.ticketType || 'General Admission'}</small>
                                                        </div>
                                                        <div className="text-end">
                                                            <div className="fw-semibold">{formatMoney(getBookingAmount(b))}</div>
                                                            <small className="text-secondary">{new Date(b.createdAt || b.bookingDate || b.created || Date.now()).toLocaleString()}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketSalesPage;
