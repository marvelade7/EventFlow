import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BrowseEvent = ({ img, title, date, venue, event, eventIcon, price, button = 'Book Now', btnStyle, anim = 'fade-up', delay = 0, actionTo, onAction, showActionButton = true, cardTo, onCardClick }) => {
    const navigate = useNavigate();

    const clickableCard = Boolean(cardTo || onCardClick);

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick();
            return;
        }
        if (cardTo) {
            navigate(cardTo);
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
                                  if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleCardClick();
                                  }
                              }
                            : undefined
                    }
                    role={clickableCard ? 'button' : undefined}
                    tabIndex={clickableCard ? 0 : undefined}
                    style={clickableCard ? { cursor: 'pointer' } : undefined}
                >
                    <img src={img} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className={'card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2'}><i className={eventIcon}></i> {event}</p>
                        <h5 className="card-title mt-3">{title}</h5>
                        <p className="card-text"><i className="bi bi-calendar me-1 "></i> {date}</p>
                        <p className="card-text"><i className="bi bi-geo-alt-fill me-1 "></i>{venue}</p>
                        <div className='d-flex align-items-center justify-content-between gap-2 mt-4'>
                            <p style={{color: 'rgb(27,181,204)'}} className=' fw-bold m-0 fs-5'>{price}</p>
                            {showActionButton && (
                                actionTo ? (
                                    <Link to={actionTo} className='text-decoration-none' onClick={(e) => e.stopPropagation()}>
                                        <button style={btnStyle} className='btn rounded-3 py-1 px-3 fw-semibold text-white'>{button}</button>
                                    </Link>
                                ) : (
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAction) onAction();
                                    }} style={btnStyle} className='btn rounded-3 py-1 px-3 fw-semibold text-white'>{button}</button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrowseEvent;