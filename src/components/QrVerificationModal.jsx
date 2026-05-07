import { useState } from 'react';
import { verifyQrPayload } from '../utils/qrVerificationApi';
import './QrVerificationModal.css';

/**
 * QR Verification Modal
 * Allows admins/organizers to verify scanned QR codes and mark attendees as checked-in
 */
const QrVerificationModal = ({ isOpen, onClose }) => {
    const [qrInput, setQrInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleVerify = () => {
        if (!qrInput.trim()) {
            setError('Please paste or input QR data');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        let parsedData;
        try {
            parsedData = JSON.parse(qrInput);
        } catch (e) {
            setLoading(false);
            setError('Invalid QR data format. Expected JSON string.');
            return;
        }

        return verifyQrPayload(parsedData)
            .then((response) => {
                setResult(response);
                setQrInput('');
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Verification failed');
                setLoading(false);
            });
    };

    const handleClear = () => {
        setQrInput('');
        setResult(null);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="qr-verification-overlay" onClick={onClose}>
            <div className="qr-verification-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qr-verification-header">
                    <h3>Verify QR Code</h3>
                    <button className="qr-verification-close" onClick={onClose}>×</button>
                </div>

                <div className="qr-verification-body">
                    {!result ? (
                        <>
                            <div className="qr-verification-input-group">
                                <label htmlFor="qr-input" className="fw-semibold mb-2">
                                    Paste Scanned QR Data:
                                </label>
                                <textarea
                                    id="qr-input"
                                    value={qrInput}
                                    onChange={(e) => setQrInput(e.target.value)}
                                    placeholder='{"payload": {...}, "signature": "..."}'
                                    className="qr-verification-textarea"
                                    rows={6}
                                />
                            </div>

                            {error && (
                                <div className="qr-verification-error">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            <div className="qr-verification-actions">
                                <button
                                    onClick={handleVerify}
                                    disabled={loading || !qrInput.trim()}
                                    className="btn btn-primary"
                                >
                                    {loading ? 'Verifying...' : 'Verify QR'}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="btn btn-outline-secondary"
                                >
                                    Clear
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="qr-verification-result">
                                <div className={`qr-result-status ${result.booking?.status === 'checked-in' ? 'checked-in' : 'booked'}`}>
                                    <strong>{result.message}</strong>
                                </div>

                                {result.booking && (
                                    <div className="qr-result-details">
                                        <h5>Booking Details</h5>
                                        <div className="detail-row">
                                            <span className="detail-label">Ticket Code:</span>
                                            <span className="detail-value">{result.booking.ticketCode}</span>
                                        </div>
                                        {result.booking.user && (
                                            <>
                                                <div className="detail-row">
                                                    <span className="detail-label">Name:</span>
                                                    <span className="detail-value">
                                                        {result.booking.user.firstName} {result.booking.user.lastName || ''}
                                                    </span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Email:</span>
                                                    <span className="detail-value">{result.booking.user.email}</span>
                                                </div>
                                            </>
                                        )}
                                        {result.booking.event && (
                                            <div className="detail-row">
                                                <span className="detail-label">Event:</span>
                                                <span className="detail-value">{result.booking.event.title}</span>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <span className="detail-label">Status:</span>
                                            <span className={`detail-value status-badge ${result.booking.status}`}>
                                                {result.booking.status === 'checked-in' ? '✓ Checked In' : 'Booked'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="qr-verification-actions">
                                <button
                                    onClick={handleClear}
                                    className="btn btn-primary"
                                >
                                    Verify Another
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrVerificationModal;
