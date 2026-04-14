import React from 'react';

const RecentBookings = () => {
    return (
        <div className='table-responsive border rounded-3 mt-4 recent-bookings-wrap'>
            <table className='table mb-0 recent-bookings-table'>
                <thead>
                    <tr className='table-secondary thead'>
                        <th>EVENT</th>
                        <th>DATE</th>
                        <th>TICKETS</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='tbody'>
                        <td>Summer Beats Festival</td>
                        <td>Aug 15, 2026</td>
                        <td>2</td>
                        <td>$98</td>
                        <td>Confirmed</td>
                        <td>View Ticket</td>
                    </tr>
                    <tr className='tbody'>
                        <td>Summer Beats Festival</td>
                        <td>Aug 15, 2026</td>
                        <td>2</td>
                        <td>$98</td>
                        <td>Confirmed</td>
                        <td>View Ticket</td>
                    </tr>
                    <tr className='tbody'>
                        <td>Summer Beats Festival</td>
                        <td>Aug 15, 2026</td>
                        <td>2</td>
                        <td>$98</td>
                        <td>Confirmed</td>
                        <td>View Ticket</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RecentBookings;