import React, { useEffect, useMemo, useRef } from 'react';

const EventMedia = ({ formik }) => {
    const fileInputRef = useRef(null);
    const hasError = (formik.touched.eventBanner || formik.submitCount > 0) && formik.errors.eventBanner;
    const imageUrl = useMemo(
        () => (formik.values.eventBanner ? URL.createObjectURL(formik.values.eventBanner) : ''),
        [formik.values.eventBanner]
    );

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const handleFileSelect = (event) => {
        const file = event.currentTarget.files?.[0] || null;
        formik.setFieldTouched('eventBanner', true, false);
        formik.setFieldValue('eventBanner', file);
    };

    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">5</p>
                <h5 className='m-0'>Event Media</h5>
            </div>
            <div
                style={{border: `1px dashed ${hasError ? '#dc3545' : 'rgba(0,0,0,.3)'}`, cursor: 'pointer'}}
                className='text-secondary event-media text-center w-100 py-5 px-4 rounded-3'
                role='button'
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        fileInputRef.current?.click();
                    }
                }}
            >
                <i style={{backgroundColor: 'rgb(243,244,246)', padding: '5px 10px'}} className='bi bi-upload fs-4 rounded-3'></i>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    className='d-none'
                    onChange={handleFileSelect}
                />
                <h6 className='mt-3 mb-0'>Drag image here or click to browse</h6>
                <small className='d-block mt-2 text-muted'>PNG, JPG, or WEBP</small>
                {formik.values.eventBanner ? (
                    <div className='mt-3'>
                        <p className='m-0 fw-medium text-dark'>{formik.values.eventBanner.name}</p>
                        <img src={imageUrl} alt='Event banner preview' className='img-fluid rounded-3 mt-3' style={{ maxHeight: '180px' }} />
                    </div>
                ) : null}
            </div>
            {hasError ? <div className='invalid-feedback d-block mt-2'>{formik.errors.eventBanner}</div> : null}
        </div>
    );
};

export default EventMedia;