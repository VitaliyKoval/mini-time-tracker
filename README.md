# Mini Time Tracker

A full-stack time tracking application built with React, TypeScript, Express, and Prisma ORM.

## Overview

Mini Time Tracker is a simple yet effective application that allows users to track their time spent on various projects and tasks. The application features a React frontend with TailwindCSS styling and an Express backend with database persistence.

## Features

- Track time entries with descriptions, dates, and hours
- View time entry history
- Add, edit, and delete time entries
- Responsive UI built with React and TailwindCSS
- RESTful API backend with Express
- Database persistence with Prisma ORM and SQLite

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: SQLite with Prisma ORM
- **API Communication**: Axios
- **State Management**: SWR for data fetching and caching
- **Validation**: Joi for backend validation

## Prerequisites

- Node.js (version >= 14.0.0)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd mini-time-tracker
```

### 2. Install Dependencies

Install dependencies for the entire project (backend and frontend):

```bash
npm run install-all
```

Alternatively, you can install dependencies separately:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

For the frontend, ensure the API URL is correctly configured in the service files. The default setup assumes the backend runs on port 3001.

### 4. Initialize the Database

Run the following commands to set up the database:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed # if you have seed data
```

This will create the SQLite database and apply the initial schema migrations.

### 5. Start the Application

From the project root directory, run:

```bash
npm run dev
```

This command starts both the backend and frontend servers concurrently:

- Backend server will run on `http://localhost:3001`
- Frontend will run on `http://localhost:5000` (or the next available port)

### Alternative: Run Servers Separately

If you prefer to run the servers separately:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Project Structure

```
mini-time-tracker/
├── backend/                 # Express server with Prisma
│   ├── src/
│   │   ├── index.ts        # Main server file
│   │   ├── middleware/     # Validation and error handling middleware
│   │   ├── schemas/        # Validation schemas
│   │   └── routes/         # API routes
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Migration files
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
├── package.json            # Root package with workspace scripts
└── README.md              # This file
```

## API Endpoints

The backend provides the following REST endpoints:

- `GET /api/time-entries` - Get all time entries
- `POST /api/time-entries` - Create a new time entry
- `PUT /api/time-entries/:id` - Update a time entry
- `DELETE /api/time-entries/:id` - Delete a time entry

## Development

### Adding New Dependencies

When adding new dependencies, make sure to install them in the appropriate subdirectory (either `backend` or `frontend`).

### Database Changes

To make changes to the database schema:

1. Modify the `schema.prisma` file
2. Run `npx prisma migrate dev --name migration-name` to create and apply the migration
3. Generate new Prisma client with `npx prisma generate`

### Environment Variables

- `DATABASE_URL`: Database connection string (for Prisma)
- `PORT`: Port number for the backend server (default: 3001)

## Building for Production

To build the application for production:

```bash
npm run build
```

This will build both the backend (compile TypeScript) and frontend (create production build).

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure ports 3001 (backend) and 5000+ (frontend) are available.

2. **Database connection errors**: Ensure you've run the Prisma migrations (`npx prisma migrate dev`).

3. **Dependency issues**: Try deleting `node_modules` and reinstalling with `npm run install-all`.

4. **Prisma client not found**: Run `npx prisma generate` in the backend directory.

### Resetting the Database

To reset the database to initial state:

```bash
cd backend
npx prisma migrate reset
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request
