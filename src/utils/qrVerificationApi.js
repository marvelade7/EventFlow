import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

/**
 * Verify a scanned QR payload on the server
 * @param {Object} envelopeData - The scanned QR data { payload, signature }
 * @returns {Promise<Object>} - Booking details and verification result
 */
export const verifyQrPayload = (envelopeData) => {
    return axios.post(`${API_BASE_URL}/bookings/verify-qr`, {
        envelope: envelopeData,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data || { message: error.message };
        });
};
