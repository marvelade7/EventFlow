import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEventLink } from "../utils/eventLink";

const BrowseEvent = ({
    img,
    title,
    date,
    venue,
    event,
    eventIcon,
    price,
    state,
    button = "Book Now",
    btnStyle,
    anim = "fade-up",
    delay = 0,
    actionTo,
    onAction,
    showActionButton = true,
    cardTo,
    onCardClick,
    showLikeButton = false,
    isLiked = false,
    likeCount = 0,
    onLike,
    creatorName,
    creatorAvatar,
    createdAt,
    isSoldOut = false,
    eventId,
    showCopyLink = false,
}) => {
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const copyTimeoutRef = useRef(null);

    const clickableCard = Boolean(cardTo || onCardClick);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick();
            return;
        }
        if (cardTo) {
            navigate(cardTo);
        }
    };

    const handleCopyLink = async (e) => {
        e.stopPropagation();

        if (!eventId) return;

        try {
            await navigator.clipboard.writeText(getEventLink(eventId));
            setIsCopied(true);
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = window.setTimeout(() => {
                setIsCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to copy event link:", error);
        }
    };

    return (
        <>
            <div className="col">
                <div
                    data-aos={anim}
                    data-aos-delay={delay}
                    className="browse-card card border-0 shadow-sm"
                    onClick={clickableCard ? handleCardClick : undefined}
                    onKeyDown={
                        clickableCard
                            ? (e) => {
                                  if (e.target.closest("button, a")) return;
                                  if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      handleCardClick();
                                  }
                              }
                            : undefined
                    }
                    role={clickableCard ? "button" : undefined}
                    tabIndex={clickableCard ? 0 : undefined}
                    style={
                        clickableCard
                            ? { cursor: "pointer", transition: "all 0.3s ease" }
                            : undefined
                    }
                >
                    {showLikeButton ? (
                        <button
                            type="button"
                            className={`browse-like-btn ${isLiked ? "liked" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike?.();
                            }}
                            aria-pressed={isLiked}
                            aria-label={isLiked ? "Unlike event" : "Like event"}
                        >
                            <i
                                className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
                            ></i>
                            {likeCount > 0 ? <span>{likeCount}</span> : null}
                        </button>
                    ) : null}
                    <img src={img} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p
                            className={
                                "card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2"
                            }
                        >
                            <i className={eventIcon}></i> {event}
                        </p>
                        <h5 className="card-title mt-3">{title}</h5>

                        <p className="card-text">
                            <i className="bi bi-calendar me-1 "></i> {date}
                        </p>
                        <p className="card-text">
                            <i className="bi bi-geo-alt-fill me-1 "></i>
                            {venue}
                        </p>
                        <div className="d-flex align-items-center justify-content-between gap-2 mt-4 flex-wrap">
                            <p
                                style={{ color: "rgb(27,181,204)" }}
                                className=" fw-bold m-0 fs-5"
                            >
                                {price}
                            </p>
                            <div className="d-flex align-items-center gap-2 ms-auto flex-wrap justify-content-end">
                                {showCopyLink && eventId ? (
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center px-2 py-1"
                                        aria-label={isCopied ? "Link copied" : "Copy event link"}
                                        title={isCopied ? "Copied" : "Copy link"}
                                    >
                                        <i
                                            className={`bi ${isCopied ? "bi-check2" : "bi-link-45deg"}`}
                                        ></i>
                                    </button>
                                ) : null}
                                {showActionButton &&
                                    (actionTo ? (
                                        <Link
                                            to={actionTo}
                                            className="text-decoration-none"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                style={
                                                    isSoldOut
                                                        ? {
                                                              backgroundColor:
                                                                  "#adb5bd",
                                                          }
                                                        : btnStyle
                                                }
                                                className="btn rounded-3 py-1 px-3 fw-semibold text-white"
                                                disabled={isSoldOut}
                                            >
                                                {isSoldOut
                                                    ? "Sold Out"
                                                    : button}
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isSoldOut && onAction)
                                                    onAction();
                                            }}
                                            style={
                                                isSoldOut
                                                    ? {
                                                          backgroundColor:
                                                              "#adb5bd",
                                                      }
                                                    : btnStyle
                                            }
                                            className="btn rounded-3 py-1 px-3 fw-semibold text-white"
                                            disabled={isSoldOut}
                                        >
                                            {isSoldOut ? "Sold Out" : button}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        {creatorName || creatorAvatar ? (
                            <div
                                style={{ marginTop: "2em" }}
                                className="browse-card-creator  mb-0 d-flex align-items-center gap-2"
                            >
                                {creatorAvatar ? (
                                    <img
                                        src={creatorAvatar}
                                        alt={creatorName || "Event creator"}
                                    />
                                ) : (
                                    <span className="browse-card-creator-fallback">
                                        {(creatorName || "E")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                )}
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    {/* <p style={{fontSize: '.8em'}} className="m-0">Hosted by</p> */}
                                    <span className="m-0">
                                        {creatorName || "Event creator"}
                                    </span>
                                    {createdAt ? (
                                        <div
                                            className="text-secondary m-0 d-flex gap-2"
                                            style={{ fontSize: ".9em" }}
                                        >
                                            <p className="m-0">
                                                {new Date(
                                                    createdAt,
                                                ).toLocaleString("en-NG", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="m-0">
                                                {new Date(
                                                    createdAt,
                                                ).toLocaleString("en-NG", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrowseEvent;
