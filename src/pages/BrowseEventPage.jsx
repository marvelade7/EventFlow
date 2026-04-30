import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import aos from "aos";
import "aos/dist/aos.css";
import CreateEventNav from "../components/CreateEventNav";
import BrowseEvent from "../components/BrowseEvent";
import BrowseEventsFilter from "../components/BrowseEventsFilter";
import BrowseEventsHead from "../components/BrowseEventsHead";
import { useNavigate, useOutletContext } from "react-router-dom";

// const EVENTS_ENDPOINT = "http://localhost:5000/api/events/get-events";
const EVENTS_ENDPOINT =
    "https://eventflow-backend-fwv4.onrender.com/api/events/get-events";

const categoryIcons = {
    music: "bi bi-music-note-beamed",
    tech: "bi bi-laptop",
    technology: "bi bi-laptop",
    sports: "bi bi-trophy",
    arts: "bi bi-palette",
    art: "bi bi-palette",
    foods: "bi bi-cup-hot",
    food: "bi bi-cup-hot",
    "food & drinks": "bi bi-cup-hot",
};

const getEventsFromResponse = (data) => {
    if (Array.isArray(data?.events)) return data.events;
    return [];
};

const getTicketTypes = (event) => {
    return Array.isArray(event?.ticketTypes) ? event.ticketTypes : [];
};

const getTicketPriceValue = (ticket) => {
    const rawPrice = ticket?.ticketPrice ?? ticket?.price;
    const parsedPrice = Number(rawPrice);
    return Number.isFinite(parsedPrice) ? parsedPrice : null;
};

const getEventImage = (event) => event?.bannerImage;

const formatEventDate = (dateTime, timeZone) => {
    if (!dateTime) return "Date TBD";

    // Parse the datetime string directly to avoid timezone conversion
    const dateStr = String(dateTime).trim();
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

    if (!match) return "Date TBD";

    const [, year, month, day, hour, minute] = match;

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthIndex = parseInt(month) - 1;

    return `${monthNames[monthIndex]} ${parseInt(day)}, ${year} ${parseInt(hour)}:${minute}`;
};

const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatPrice = (event) => {
    if (event?.isFree === true || event?.isFree === "true") return "Free";

    const prices = getTicketTypes(event)
        .map((ticket) => getTicketPriceValue(ticket))
        .filter((price) => Number.isFinite(price));

    if (prices.length > 0) {
        const lowestPrice = Math.min(...prices);
        return formatMoney(lowestPrice);
    }

    return "Price TBD";
};

const getVenue = (event) => {
    const location = event?.location || {};
    const parts = [location.venue, location.city, location.country].filter(
        Boolean,
    );
    return parts.length ? parts.join(", ") : "Venue TBD";
};

const getFullAddress = (event) => {
    const location = event?.location || {};
    const parts = [
        location.venue,
        location.address,
        location.city,
        location.country,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "Venue TBD";
};

const getCategory = (event) => event?.category || "Event";

const getCategoryIcon = (category) =>
    categoryIcons[String(category).toLowerCase()] || "bi bi-calendar-event";

const getEventTitle = (event) => event?.title || "Untitled Event";

const getEventId = (event, index = 0) =>
    event?._id || `${getEventTitle(event)}-${index}`;

const getHostName = (event) => {
    const host = event?.createdBy;
    const name = [host?.firstName, host?.lastName].filter(Boolean).join(" ");
    return name || "Event host";
};

const getAvailableTickets = (ticket) => {
    const quantity = Number(ticket?.quantity);
    const sold = Number(ticket?.sold || 0);

    if (!Number.isFinite(quantity)) return "Available";

    return `${Math.max(quantity - sold, 0)} available`;
};

const BrowseEventPage = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [likedEvents, setLikedEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        aos.init({
            duration: 1000,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const controller = new AbortController();
        let isActive = true;

        axios
            .get(EVENTS_ENDPOINT, {
                signal: controller.signal,
                headers: token
                    ? {
                          Authorization: `Bearer ${token}`,
                          Accept: "application/json",
                      }
                    : {
                          Accept: "application/json",
                      },
            })
            .then((res) => {
                if (!isActive) return;
                setEvents(getEventsFromResponse(res.data));
            })
            .catch((err) => {
                if (err.name === "CanceledError" || !isActive) return;
                console.error(
                    "Error fetching events:",
                    err.response?.data || err.message,
                );
                setError(
                    err.response?.data?.message ||
                        "Unable to load events right now.",
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
    }, []);

    const categories = useMemo(() => {
        const eventCategories = events
            .map((event) => getCategory(event))
            .filter(Boolean);
        return ["All", ...new Set(eventCategories)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        if (activeCategory === "All") return events;
        return events.filter((event) => getCategory(event) === activeCategory);
    }, [activeCategory, events]);

    const selectedTicketTypes = getTicketTypes(selectedEvent);

    const handleLikeEvent = (eventId) => {
        setLikedEvents((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    const getLikeCount = (event, eventId) => {
        const currentLikes = Array.isArray(event?.likes)
            ? event.likes.length
            : 0;
        return likedEvents[eventId] ? currentLikes + 1 : currentLikes;
    };

    return (
        <div
            className="create-event-main"
            style={{
                marginLeft: "300px",
                background: "rgb(249,250,251)",
                minHeight: "100vh",
            }}
        >
            <CreateEventNav
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={sidebarOpen}
                title="Browse Events"
                actionLabel="Create Event"
                onActionClick={() => navigate("/dashboard/create-event")}
            />

            <div className="px-4 pb-4 pt-4">
                <div data-aos="fade-up">
                    <div style={{position: 'sticky', top:'80px', zIndex: '1000'}} className="mb-4 bg-white pt-4 pb-1 px-4 rounded-3 shadow-sm" >
                        <BrowseEventsHead
                            style={{ fontSize: "1.5em" }}
                            title="Find Your Next Event"
                        />

                        <BrowseEventsFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onFilterSelect={setActiveCategory}
                            filterEvent={{
                                backgroundColor: "rgb(234, 238, 246)",
                            }}
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-info"
                                role="status"
                                aria-hidden="true"
                            ></div>
                            <p className="mt-2 mb-0 text-secondary fw-semibold">
                                Loading events...
                            </p>
                        </div>
                    ) : error ? (
                        <div
                            className="alert alert-warning mb-0 d-flex"
                            role="alert"
                        >
                            {error}
                            <p>try again</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-5 border rounded-4 bg-light">
                            <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                            <h6 className="mt-3 mb-1">No events found</h6>
                            <p className="text-secondary mb-0">
                                Try another category or check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mt-1">
                            {filteredEvents.map((event, index) => {
                                const category = getCategory(event);
                                const eventId = getEventId(event, index);

                                return (
                                    <BrowseEvent
                                        key={eventId}
                                        img={getEventImage(event)}
                                        title={getEventTitle(event)}
                                        venue={getVenue(event)}
                                        date={formatEventDate(
                                            event?.startDateTime,
                                            event?.timeZone,
                                        )}
                                        event={category}
                                        eventIcon={getCategoryIcon(category)}
                                        price={formatPrice(event)}
                                        createdAt={event?.createdAt}
                                        creatorName={getHostName(event)}
                                        creatorAvatar={
                                            event?.createdBy?.profilePic
                                        }
                                        button="Book Now"
                                        anim="fade-up"
                                        delay={index * 70}
                                        btnStyle={{
                                            backgroundColor: "rgb(27,181,204)",
                                        }}
                                        showLikeButton
                                        isLiked={Boolean(likedEvents[eventId])}
                                        likeCount={getLikeCount(event, eventId)}
                                        onLike={() => handleLikeEvent(eventId)}
                                        onAction={() =>
                                            navigate("/dashboard/checkout")
                                        }
                                        onCardClick={() =>
                                            setSelectedEvent(event)
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {selectedEvent
                ? createPortal(
                      <>
                          <div
                              className="modal fade show d-block browse-event-modal"
                              tabIndex="-1"
                              role="dialog"
                              aria-modal="true"
                          >
                              <div
                                  className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                                  role="document"
                              >
                                  <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
                                      <img
                                          src={getEventImage(selectedEvent)}
                                          alt={getEventTitle(selectedEvent)}
                                          className="browse-event-modal-img"
                                      />
                                      <div className="modal-body p-4">
                                          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                                              <div>
                                                  <p className="card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2">
                                                      <i
                                                          className={getCategoryIcon(
                                                              getCategory(
                                                                  selectedEvent,
                                                              ),
                                                          )}
                                                      ></i>
                                                      {getCategory(
                                                          selectedEvent,
                                                      )}
                                                  </p>
                                                  <h4 className="mt-3 mb-2">
                                                      {getEventTitle(
                                                          selectedEvent,
                                                      )}
                                                  </h4>
                                                  <p className="text-secondary mb-0">
                                                      {selectedEvent?.description ||
                                                          "No description has been added for this event."}
                                                  </p>
                                              </div>
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      setSelectedEvent(null)
                                                  }
                                                  className="btn btn-light border rounded-circle browse-modal-close"
                                                  aria-label="Close event details"
                                              >
                                                  <i className="bi bi-x-lg"></i>
                                              </button>
                                          </div>

                                          <div className="row g-3 my-2">
                                              <div className="col-md-6">
                                                  <div className="border rounded-4 p-3 h-100">
                                                      <p className="text-secondary mb-1">
                                                          Starts
                                                      </p>
                                                      <h6 className="mb-0">
                                                          <i className="bi bi-calendar-event me-2"></i>
                                                          {formatEventDate(
                                                              selectedEvent?.startDateTime,
                                                              selectedEvent?.timeZone,
                                                          )}
                                                      </h6>
                                                  </div>
                                              </div>
                                              <div className="col-md-6">
                                                  <div className="border rounded-4 p-3 h-100">
                                                      <p className="text-secondary mb-1">
                                                          Ends
                                                      </p>
                                                      <h6 className="mb-0">
                                                          <i className="bi bi-clock me-2"></i>
                                                          {formatEventDate(
                                                              selectedEvent?.endDateTime,
                                                              selectedEvent?.timeZone,
                                                          )}
                                                      </h6>
                                                  </div>
                                              </div>
                                              <div className="col-md-8">
                                                  <div className="border rounded-4 p-3 h-100">
                                                      <p className="text-secondary mb-1">
                                                          Location
                                                      </p>
                                                      <h6 className="mb-0">
                                                          <i className="bi bi-geo-alt-fill me-2"></i>
                                                          {getFullAddress(
                                                              selectedEvent,
                                                          )}
                                                      </h6>
                                                  </div>
                                              </div>
                                              <div className="col-md-4">
                                                  <div className="border rounded-4 p-3 h-100">
                                                      <p className="text-secondary mb-1">
                                                          Ticket Price
                                                      </p>
                                                      <h6
                                                          style={{
                                                              color: "rgb(27,181,204)",
                                                          }}
                                                          className="mb-0"
                                                      >
                                                          {formatPrice(
                                                              selectedEvent,
                                                          )}
                                                      </h6>
                                                  </div>
                                              </div>
                                              <div className="col-md-6">
                                                  <div className="border rounded-4 p-3 h-100 d-flex align-items-center gap-3">
                                                      {selectedEvent?.createdBy
                                                          ?.profilePic ? (
                                                          <img
                                                              src={
                                                                  selectedEvent
                                                                      .createdBy
                                                                      .profilePic
                                                              }
                                                              alt={getHostName(
                                                                  selectedEvent,
                                                              )}
                                                              className="browse-event-host-img"
                                                          />
                                                      ) : null}
                                                      <div>
                                                          <p className="text-secondary mb-1">
                                                              Hosted by
                                                          </p>
                                                          <h6 className="mb-0">
                                                              {getHostName(
                                                                  selectedEvent,
                                                              )}
                                                          </h6>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="col-md-6">
                                                  <div className="border rounded-4 p-3 h-100">
                                                      <p className="text-secondary mb-1">
                                                          Status
                                                      </p>
                                                      <h6 className="mb-0 text-capitalize">
                                                          {selectedEvent?.status ||
                                                              "upcoming"}
                                                      </h6>
                                                  </div>
                                              </div>
                                          </div>

                                          {selectedTicketTypes.length > 0 ? (
                                              <div className="mt-3">
                                                  <h6>Tickets</h6>
                                                  <div className="d-flex flex-column gap-2">
                                                      {selectedTicketTypes.map(
                                                          (ticket, index) => (
                                                              <div
                                                                  key={`${ticket?.name || "ticket"}-${index}`}
                                                                  className="border rounded-4 p-3 d-flex align-items-center justify-content-between gap-3"
                                                              >
                                                                  <div>
                                                                      <p className="fw-semibold mb-1">
                                                                          {ticket?.name ||
                                                                              "General Admission"}
                                                                      </p>
                                                                      <p className="text-secondary mb-0">
                                                                          {getAvailableTickets(
                                                                              ticket,
                                                                          )}
                                                                      </p>
                                                                  </div>
                                                                  <p
                                                                      style={{
                                                                          color: "rgb(223,127,7)",
                                                                      }}
                                                                      className="fw-bold mb-0"
                                                                  >
                                                                      {formatMoney(
                                                                          getTicketPriceValue(
                                                                              ticket,
                                                                          ) ??
                                                                              0,
                                                                      )}
                                                                  </p>
                                                              </div>
                                                          ),
                                                      )}
                                                  </div>
                                              </div>
                                          ) : null}

                                          <div className="d-flex align-items-center justify-content-end gap-3 mt-4">
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      setSelectedEvent(null)
                                                  }
                                                  className="btn btn-outline-light text-dark border rounded-3 py-2 px-3"
                                              >
                                                  Close
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      navigate(
                                                          "/dashboard/checkout",
                                                      )
                                                  }
                                                  style={{
                                                      backgroundColor:
                                                          "rgb(27,181,204)",
                                                  }}
                                                  className="btn rounded-3 text-white py-2 fw-semibold px-3"
                                              >
                                                  Book Now
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div
                              className="modal-backdrop fade show browse-event-backdrop"
                              onClick={() => setSelectedEvent(null)}
                          ></div>
                      </>,
                      document.body,
                  )
                : null}
        </div>
    );
};

export default BrowseEventPage;
