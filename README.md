# Resume Commentor

A full-stack web application that enables users to upload, review, and comment on resumes. Built with React and Node.js.

## Project Structure

```
resume-commentor/
├── frontend/    # React application
└── backend/     # Node.js API server
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v6.0 or higher)

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The API server will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Features

- User authentication and authorization
- Resume upload and management
- Real-time commenting system
- PDF preview and annotation
- User profile management

## Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License
