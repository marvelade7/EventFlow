# EventFlow

EventFlow is a modern event management frontend built with React and Vite. It brings together event discovery, ticket booking, event creation, attendee check-in, and dashboard management in one experience.

**Production link:** https://marvel-event-flow.vercel.app

The application is designed for two main workflows:

- Attendees can browse events, sign up, sign in, book tickets, manage their profile, and view their bookings.
- Organizers can create events, edit event details, track event performance, manage ticket sales, and verify QR-code tickets at the door.

## What the project does

EventFlow acts as the user interface for a larger event platform. It connects to a backend API for authentication, event data, bookings, payments, email verification, password reset, and scanner-based check-in.

At a glance, the app supports:

- Public event discovery on the landing page
- Authentication and account recovery flows
- A protected user dashboard with booking and event tools
- Event creation and event editing
- Checkout and payment initiation
- Booking history and ticket management
- QR scanner-based attendee check-in
- An admin dashboard for moderation and platform oversight

## Main features

### Public experience

- A landing page with a hero section, featured events, and explanatory sections.
- Browseable event cards with category filtering.
- Clear calls to action for users who want to sign up or host an event.
- Dedicated Terms & Conditions and Privacy Policy pages linked from the navbar, footer, and auth screens.
- Public event detail pages with banner imagery, ticket info, host details, and booking actions.

### Authentication and account flows

- Sign up and sign in screens.
- Email verification.
- Forgot password and reset password flows.
- Token-based route protection for authenticated areas.

### User dashboard

- Personalized dashboard shell with sidebar navigation.
- Event summary cards and upcoming event previews.
- Profile management.
- Booking and ticket pages.
- Event browsing and checkout from within the dashboard.

### Organizer tools

- Create a new event.
- Edit an existing event from the organizer event page.
- Upload banner images and manage ticket pricing.
- View ticket sales for a specific event.
- Use the scanner page to verify tickets and check attendees in.

### Admin area

- A separate admin dashboard entry point.
- Moderation-style overview panels for events, users, and posts.
- A dedicated auth page for the admin flow.

### Theme customization

- **Dark mode support** across all dashboard pages, modals, forms, and UI components.
- Theme toggle button in the dashboard navbar for quick switching between light and dark modes.
- Persistent theme preference stored in browser localStorage.
- Professional gray background in dark mode for comfortable viewing at any time of day.

## Tech stack

- React 19
- Vite
- React Router
- Axios
- Bootstrap and Bootstrap Icons
- Formik and Yup for form handling and validation
- AOS for scroll animations
- html5-qrcode and qrcode for scanning and ticket workflows
- html2canvas for image capture or export-style interactions

## Project structure

```text
src/
	components/      Reusable UI pieces for navigation, cards, forms, and dashboard sections
	context/         Shared state, including profile data and theme context
	pages/           Route-level screens for the landing page, auth, dashboards, checkout, and scanner
	utils/           API helpers and small utility functions
	App.jsx          Application routes and protected route handling
	main.jsx         App bootstrap and router setup
```

## Routes

Some of the main routes in the app are:

- `/` - landing page
- `/signup` - registration
- `/signin` - login
- `/verify-email` - email verification
- `/forgot-password` - password recovery request
- `/reset-password/:token` - password reset form
- `/privacy-policy` - privacy policy page
- `/terms-and-conditions` - terms and conditions page
- `/get-events/:eventId` - public event details page
- `/dashboard` - protected user dashboard
- `/dashboard/profile` - profile management
- `/dashboard/my-event` - organizer event management
- `/dashboard/create-event` - event creation
- `/dashboard/checkout` - checkout flow
- `/dashboard/tickets` - ticket history
- `/dashboard/browse-event` - event browsing
- `/dashboard/scanner` - QR check-in scanner
- `/dashboard/ticket-sales/:eventId` - event ticket sales view
- `/admin-auth` - admin login
- `/admin-dashboard` - admin overview

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the codebase

```bash
npm run lint
```

## Environment configuration

The app reads the backend base URL from `VITE_API_BASE_URL`.

If it is not set, the frontend falls back to the default deployed API used throughout the project.

Example:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api
```

## How the app is organized

The app is built around a shared layout and a route-based experience:

- Public pages focus on discovery and conversion.
- Protected dashboard pages reuse the same shell, sidebar, and top navigation.
- Shared API helpers keep most network calls in one place.
- Event, ticket, and scanner pages handle the core organizer workflow.
- Shared event cards surface sold-out status consistently across the app.
- Event links can be copied from supported event lists and event detail views.

## Notes

- The user dashboard uses protected routing and loads account data from the backend after login.
- The landing page fetches live events and filters them by category.
- The scanner page is meant for organizer check-in at the venue and depends on QR-code data from bookings.
- Some admin pages are currently structured with local sample data, which makes the interface easy to explore even without a live admin backend.
- Theme preference (light/dark mode) is automatically persisted to localStorage and restored on the next visit.
- Auth flows preserve a pending booking so users can continue to checkout after signing in or signing up.

## Why this project exists

EventFlow is meant to make event operations feel simpler on both sides of the experience. Users can discover and book events quickly, while organizers get the tools they need to publish events, track attendance, and manage the ticketing lifecycle without switching between multiple systems.

## Contributing

Contributions are welcome — open an issue or submit a pull request. Please include a clear description of the change and any steps required to reproduce or test it locally.

## License

This repository is provided under the MIT License. See the `LICENSE` file for details.
