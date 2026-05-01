import React, { useContext, useEffect, useState } from 'react';
import CreateEventNav from '../components/CreateEventNav';
import EventBasis from '../components/EventBasis';
import DateAndTimeForm from '../components/DateAndTimeForm';
import Location from '../components/Location';
import Tickets from '../components/Tickets';
import EventMedia from '../components/EventMedia';
import LivePreview from '../components/LivePreview';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import aos from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';

const CreateNewEventPage = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();
    const { user } = useContext(ProfileContext);
    const isUserLoaded = user !== null;
    const isEmailVerified = Boolean(user?.isVerified);
    const canPublish = isUserLoaded && isEmailVerified;
    const [notifications, setNotifications] = useState([]);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const today = now.toISOString().split('T')[0];

    const showNotification = (message, type = "info") => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications((prev) => [...prev, notification]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    const formik = useFormik({
        initialValues: {
            eventName: '',
            category: '',
            description: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            timeZone: 'Africa/Lagos',
            venueName: '',
            address: '',
            city: '',
            state: '',
            country: '',
            isFree: false,
            ticketPrice: 1,
            availableTickets: 10,
            eventBanner: null,
        },
        validationSchema: Yup.object({
            eventName: Yup.string().trim().required('Event name is required'),
            category: Yup.string().required('Category is required'),
            description: Yup.string().trim().required('Description is required'),
            startDate: Yup.string()
                .required('Start date is required')
                .test('start-not-past', 'Start date cannot be before today', (value) => !value || value >= today),
            startTime: Yup.string().required('Start time is required'),
            endDate: Yup.string()
                .required('End date is required')
                .test('end-not-past', 'End date cannot be before today', (value) => !value || value >= today)
                .test('end-not-before-start', 'End date cannot be before start date', function (value) {
                    const { startDate } = this.parent;
                    if (!value || !startDate) {
                        return true;
                    }

                    return value >= startDate;
                }),
            endTime: Yup.string()
                .required('End time is required')
                .test('end-after-start', 'End time must be after start time', function (value) {
                    const { startDate, endDate, startTime } = this.parent;

                    if (!value || !startDate || !endDate || !startTime) {
                        return true;
                    }

                    if (endDate > startDate) {
                        return true;
                    }

                    return value > startTime;
                }),
            timeZone: Yup.string().required('Time zone is required'),
            venueName: Yup.string().trim().required('Venue name is required'),
            address: Yup.string().trim().required('Address is required'),
            city: Yup.string().trim().required('City is required'),
            state: Yup.string().trim().required('State is required'),
            country: Yup.string().trim().required('Country is required'),
            availableTickets: Yup.number()
                .typeError('Tickets must be a number')
                .min(10, 'Minimum tickets is 10')
                .required('Available tickets is required'),
            ticketPrice: Yup.number().when('isFree', {
                is: false,
                then: (schema) =>
                    schema
                        .typeError('Ticket price must be a number')
                        .min(1, 'Price must be at least 1')
                        .required('Ticket price is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
            eventBanner: Yup.mixed()
                .required('Event banner is required')
                .test(
                    'fileType',
                    'Only JPG, PNG, and WEBP images are allowed',
                    (value) =>
                        value &&
                        ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
                ),
        }),
        onSubmit: (values, { setSubmitting }) => {
            if (!canPublish) {
                setSubmitting(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setSubmitting(false);
                return;
            }

            const formData = new FormData();
            
            // Map frontend field names to backend expectations
            formData.append('title', values.eventName);
            formData.append('description', values.description);
            formData.append('category', values.category);
            formData.append('startDate', values.startDate);
            formData.append('startTime', values.startTime);
            formData.append('endDate', values.endDate);
            formData.append('endTime', values.endTime);
            formData.append('venue', values.venueName);
            formData.append('address', values.address);
            formData.append('city', values.city);
            formData.append('country', values.country);
            formData.append('isFree', String(values.isFree));
            formData.append('timeZone', values.timeZone);
            
            // Handle ticketTypes - send as JSON string for now
            if (!values.isFree) {
                const ticketTypes = [
                    {
                        name: 'General Admission',
                        ticketPrice: Number(values.ticketPrice),
                        quantity: Number(values.availableTickets),
                    }
                ];
                formData.append('ticketTypes', JSON.stringify(ticketTypes));
            } else {
                formData.append('ticketTypes', JSON.stringify([]));
            }
            
            // Append banner image at the end
            if (values.eventBanner) {
                formData.append('banner', values.eventBanner);
            }

            axios.post(
                'https://eventflow-backend-fwv4.onrender.com/api/events/create-event',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                console.log('Event created:', res.data);
                showNotification('Event created successfully!', 'success');
                formik.resetForm();
            })
            .catch((err) => {
                console.error('Error creating event:', err.response?.data || err.message);
                showNotification(`Error: ${err.response?.data?.message || err.message}`, 'error');
            })
            .finally(() => {
                setSubmitting(false);
            });
        },
    });

    const handleSaveDraft = () => {
        console.log('Saving draft:', formik.values);
    };

    useEffect(() => {
        aos.init({
            duration: 750,
            once: true,
            easing: 'ease-out-cubic',
            offset: 30,
        });
    }, []);

    return (
        <div className='create-event-main' style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <div data-aos='fade-down'>
                        <CreateEventNav
                            onToggleSidebar={toggleSidebar}
                            isSidebarOpen={sidebarOpen}
                            onSaveDraft={handleSaveDraft}
                            isSubmitting={formik.isSubmitting}
                            isPublishDisabled={!canPublish}
                            title='Create New Event'
                        />
                    </div>

                    {!isUserLoaded ? (
                        <div className='mx-4 mt-3 alert alert-info'>Checking your account status...</div>
                    ) : !isEmailVerified ? (
                        <div className='mx-4 mt-3 alert alert-warning'>Verify your email before publishing an event.</div>
                    ) : null}

                    <div className='d-flex gap-3 px-4 pb-4 mt-2 create-event-layout'>
                        <div className='create-event-form-column' style={{width: '70%'}}>
                            <div className='my-4' data-aos='fade-up' data-aos-delay='60'>
                                <EventBasis formik={formik} />
                            </div>
                            <div className='my-4' data-aos='fade-up' data-aos-delay='110'>
                                <DateAndTimeForm formik={formik} />
                            </div>
                            <div className='my-4' data-aos='fade-up' data-aos-delay='160'>
                                <Location formik={formik} />
                            </div>
                            <div className='my-4' data-aos='fade-up' data-aos-delay='210'>
                                <Tickets formik={formik} />
                            </div>
                            <div data-aos='fade-up' data-aos-delay='260'>
                                <EventMedia formik={formik} />
                            </div>
                        </div>
                        
                        <div className='py-4 create-event-preview-column' style={{width: '30%'}} data-aos='fade-left' data-aos-delay='180'>
                            <LivePreview
                                values={formik.values}
                                isSubmitting={formik.isSubmitting}
                                onSaveDraft={handleSaveDraft}
                                isPublishDisabled={!canPublish}
                            />
                        </div>
                    </div>
                </form>

                {/* Toast Notifications */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        maxWidth: "500px",
                        width: "90%",
                    }}
                >
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                                marginBottom: "10px",
                                animation: "slideIn 0.3s ease-in-out",
                            }}
                        >
                            <div
                                className={`alert alert-${
                                    notification.type === "success"
                                        ? "success"
                                        : notification.type === "error"
                                        ? "danger"
                                        : "info"
                                } d-flex align-items-center gap-2 mb-0`}
                                role="alert"
                                style={{
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    borderRadius: "8px",
                                    animation: "slideOut 0.3s ease-in-out 2.7s forwards",
                                }}
                            >
                                {notification.type === "success" && (
                                    <i className="bi bi-check-circle-fill"></i>
                                )}
                                {notification.type === "error" && (
                                    <i className="bi bi-exclamation-circle-fill"></i>
                                )}
                                {notification.type === "info" && (
                                    <i className="bi bi-info-circle-fill"></i>
                                )}
                                <span>{notification.message}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes slideIn {
                        from {
                            transform: translateY(100px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOut {
                        to {
                            transform: translateY(100px);
                            opacity: 0;
                        }
                    }
                `}</style>
        </div>
    );
};

export default CreateNewEventPage;
