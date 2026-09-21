# Task Manager

A full-stack task manager built with the MERN stack (MongoDB, Express, React, Node.js), using access + refresh JWTs for authentication.

## Stack

- **Frontend:** React (Vite), React Router, Context API, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt

## Auth design

- **Access token** — short-lived (15m), returned in the response body, stored in `localStorage`, sent as `Authorization: Bearer <token>`.
- **Refresh token** — long-lived (7d), stored in an `httpOnly` cookie (not reachable by JS, mitigates XSS token theft).
- An Axios response interceptor on the frontend catches `401`s, silently calls `/api/auth/refresh`, retries the original request, and queues any concurrent requests that fail while a refresh is in flight — so users are never logged out mid-session by an expired access token.

## Project structure

```
backend/
  config/db.js            MongoDB connection
  models/                 User, Task schemas
  middleware/             JWT auth guard, error handler
  controllers/            Auth & task business logic
  routes/                 /api/auth, /api/tasks
  utils/                  Token generation, asyncHandler wrapper
  server.js

frontend/
  src/api/axios.js        Configured client + refresh interceptor
  src/context/            AuthContext (login/register/logout state)
  src/pages/              Login, Register, Dashboard
  src/components/         TaskForm, TaskItem, PrivateRoute
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT secrets
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## API

| Method | Endpoint             | Auth | Description          |
|--------|-----------------------|------|-----------------------|
| POST   | /api/auth/register    | –    | Create account        |
| POST   | /api/auth/login       | –    | Log in                |
| POST   | /api/auth/refresh     | –    | Rotate access token   |
| POST   | /api/auth/logout      | –    | Clear refresh cookie  |
| GET    | /api/tasks            | ✔    | List user's tasks     |
| POST   | /api/tasks            | ✔    | Create task           |
| GET    | /api/tasks/:id        | ✔    | Get one task          |
| PUT    | /api/tasks/:id        | ✔    | Update task           |
| DELETE | /api/tasks/:id        | ✔    | Delete task           |

All task routes are scoped to `req.userId`, so a user can never read or modify another user's data.

## License

MIT
"# Syntecxhub-Task_Manager" 
