import React, { useEffect } from 'react';
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

const CreateNewEventPage = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const today = now.toISOString().split('T')[0];

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
        onSubmit: async (values, { setSubmitting }) => {
            // try {
            //     // Replace with API request when backend endpoint is ready.
            //     console.log('Publishing event:', values);
            // } finally {
            //     setSubmitting(false);
            // }
            axios.post('https://eventflow-backend-fwv4.onrender.com/api/events/create-event').then((event) => {
                console.log(event.message)
            })
            .then((err) => {
                console.log(err);
            })
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
                            title='Create New Event'
                        />
                    </div>

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
                            />
                        </div>
                    </div>
                </form>
        </div>
    );
};

export default CreateNewEventPage;