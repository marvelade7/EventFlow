import React from 'react'
import CreateEventNav from '../components/CreateEventNav';
import RecentBookings from '../components/RecentBookings';
import { useOutletContext } from 'react-router-dom';

const MyTicketPage = () => {
  const { sidebarOpen, toggleSidebar } = useOutletContext();

  return (
  <div
    className="create-event-main"
    style={{ marginLeft: "300px", background: "rgb(249,250,251)" }}
  >
      <CreateEventNav
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
        title="My Tickets"
        actionLabel=""
      />
      <div className="p-4">
        <div className="bg-white border rounded-4 shadow-sm p-4">
          <h4 className="mb-1">Your tickets</h4>
          <p className="text-secondary mb-0">
            Every confirmed booking appears here with a copyable ticket code.
          </p>
          <RecentBookings />
        </div>
      </div>
  </div>
  )
}

export default MyTicketPage