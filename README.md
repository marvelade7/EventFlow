# EventFlow

EventFlow is a React and Vite frontend for an event discovery and management platform. It supports public browsing, user authentication, event creation, booking and ticket workflows, QR-based check-in, and a separate admin dashboard.

**Production link:** https://marvel-event-flow.vercel.app

## Overview

The app is split into two main experiences:

- Attendees can browse events, sign up or sign in, view event details, manage their profile, and access bookings and tickets.
- Organizers can create and manage events, review ticket sales, and use the scanner page for attendee check-in.

An admin area is also available for platform oversight, moderation, and stats review.

## Features

- Public landing page with featured events, category filtering, and calls to action.
- Event detail pages with ticket info, venue data, and booking actions.
- Authentication flows for sign up, sign in, email verification, forgot password, and reset password.
- Protected user dashboard with profile, event management, checkout, ticket history, browse, and scanner pages.
- Admin dashboard with overview, event management, user management, post moderation, and platform controls.
- Dark mode support with theme preference saved in `localStorage`.
- Scroll animations powered by AOS.

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Bootstrap and Bootstrap Icons
- Formik and Yup
- Firebase authentication setup for Google sign-in support
- AOS for animation
- html5-qrcode, qrcode, and html2canvas for ticket and scan-related flows

## Project Structure

```text
src/
  components/   Reusable UI pieces for navigation, cards, forms, dashboards, and event flows
  context/      Shared app state such as profile and theme context
  pages/        Route-level screens for public pages, auth, dashboards, checkout, and admin
  utils/        API helpers and small utility functions
  App.jsx       Application routes and protected route handling
  main.jsx      App bootstrap, router, and theme provider setup
```

## Routes

Main routes in the app include:

- `/` - home page
- `/signup` - registration
- `/signin` - login
- `/verify-email` - email verification
- `/forgot-password` - password recovery request
- `/reset-password/:token` - password reset form
- `/privacy-policy` - privacy policy
- `/terms-and-conditions` - terms and conditions
- `/get-events/:eventId` - public event details
- `/dashboard` - protected user dashboard
- `/dashboard/profile` - profile management
- `/dashboard/my-event` - organizer event management
- `/dashboard/create-event` - create event
- `/dashboard/checkout` - checkout flow
- `/dashboard/tickets` - ticket history
- `/dashboard/browse-event` - browse events
- `/dashboard/scanner` - QR check-in scanner
- `/dashboard/ticket-sales/:eventId` - ticket sales view for a specific event
- `/admin/login` - admin login
- `/admin/dashboard` - admin dashboard

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

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

## Environment Variables

The app reads API settings from Vite environment variables.

Required or commonly used values:

- `VITE_API_BASE_URL` - backend base URL for most API requests
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project id
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender id
- `VITE_FIREBASE_APP_ID` - Firebase app id

If Firebase variables are missing, the app still loads and logs a warning instead of crashing.

Example:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api
```

## Implementation Notes

- The landing page fetches events from the backend and filters them by category.
- Protected dashboard routes rely on tokens stored in `localStorage`.
- Theme preference is restored from `localStorage` and applied to the document body.
- The admin dashboard uses its own token and redirects to `/admin/login` when access is missing or invalid.
- The app uses a fixed backend endpoint for some event requests and a configurable API base URL for the rest.

## Contributing

Contributions are welcome. Please include a clear description of the change and any steps needed to test it locally.
