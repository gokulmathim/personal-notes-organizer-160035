# Notes Frontend (React)

A modern, minimalistic web UI for creating, editing, and organizing personal notes. Built with React, React Router, and vanilla CSS.

## Features

- User authentication (sign up, sign in, sign out)
- Create, edit, delete, and view notes
- Organize by tags and categories
- Search notes
- Responsive, minimal UI using brand colors
  - primary: `#1976d2`
  - secondary: `#90caf9`
  - accent: `#ffb300`
- Environment-based API configuration

## Quick Start

1) Install dependencies:
   npm install

2) Configure environment:
   - Copy .env.example to .env
   - Set REACT_APP_API_BASE_URL to your backend URL (e.g., http://localhost:8000)

3) Run the development server:
   npm start

4) Run tests:
   npm test

## Environment Variables

Create a .env file in this directory using .env.example as reference:

- REACT_APP_API_BASE_URL: Base URL of the backend API
- REACT_APP_SITE_URL: Public site URL (optional)

## API Assumptions

The frontend expects the following REST endpoints (adjust as needed):
- POST /auth/login -> { token, user }
- POST /auth/signup -> { token, user }
- GET /auth/me -> user
- GET /notes?search=&tags=a,b&category= -> [note]
- GET /notes/:id -> note
- POST /notes -> note
- PUT /notes/:id -> note
- DELETE /notes/:id -> { success: true }
- GET /tags -> [string]
- GET /categories -> [string]

Update src/services/api.js if your API differs.

## Project Structure

- src/services/api.js: API client using fetch
- src/context/AuthContext.js: Authentication state and actions
- src/pages: LoginPage, SignupPage, NotesPage, NotFound
- src/components: Header, Sidebar, NoteCard, NoteEditorModal
- src/routes/PrivateRoute.jsx: Route guard for authenticated pages
- src/App.js: Routes setup and theme toggle
- src/App.css: Global styles and layout

## Styling

Colors and theme variables are defined in src/App.css. Dark mode toggle is available in the top-right corner.

## Notes

- This app uses localStorage to persist auth token and user data
- All API calls include the Authorization: Bearer <token> header when signed in
- Minimal dependencies to keep the bundle small and fast
