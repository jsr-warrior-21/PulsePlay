# VideoPlayStation (PulsePlay) 🚀

# Live Link - [https://pulseplays.netlify.app/]

A robust, full-stack video hosting and content-sharing ecosystem inspired by YouTube. Built using the MERN stack, this platform handles complex media processing, relational aggregations via MongoDB pipelines, and real-time social interactions like tweets, comments, likes, and playlists.

## 📺 Features

* **User Management:** Secure registration, JWT-secured login with access/refresh tokens, profile updating, and watch history tracking.
* **Video Ecosystem:** Video publishing with automated duration/thumbnail parsing via Cloudinary, grid pagination, stream management, and view tracking.
* **Social Interactions:** Real-time like toggles for videos/comments and structured multi-tier subscription engines (subscribe/unsubscribe).
* **Micro-Blogging (Tweets):** Users can create, update, and search short-form text tweets within the platform.
* **Playlist Systems:** Dynamic creation, updating, and sequencing of custom video playlists.
* **Global Search Engine:** Text-index powered fuzzy matching search for users, videos, and tweets.

---

## 🛠️ Tech Stack

### Backend
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM (utilizes complex Aggregation Pipelines)
* **Media Storage:** Cloudinary SDK (Direct stream uploads for chunks)
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt, Cookie-Parser

### Frontend (Upcoming/In Progress)
* **Library:** React.js (Vite workflow)
* **Styling:** Tailwind CSS
* **State Management:** Redux Toolkit / React Context API
* **HTTP Client:** Axios (Configured with credentials interceptors)

---

## 📂 Project Architecture

```text
├── backend/
│   ├── src/
│   │   ├── controllers/   # App logic (video, user, like, playlist, tweet)
│   │   ├── models/        # MongoDB schemas (User, Video, Comment, Like, etc.)
│   │   ├── routes/        # Express route definitions
│   │   ├── middlewares/   # Auth interceptors, Multer file upload storage
│   │   ├── db/            # Database initialization script
│   │   └── app.js         # Express configuration
│   └── index.js           # Server listener entrypoint
└── frontend/
    ├── src/
    │   ├── api/           # Axios global client instance
    │   ├── components/    # Reusable UI components (VideoCard, Navbar)
    │   └── pages/         # Core views (Home, Dashboard, Watch)

```
## 📡 API Endpoints Blueprint
All responses strictly follow a uniform envelope structure:

JSON
{ "statusCode": 200, "data": {}, "message": "Success", "success": true }
Authentication & Users
POST /api/v1/users/register - Create a new account (handles Avatar/Cover images).

POST /api/v1/users/login - Generates accessToken & refreshToken via secure HTTP-Only cookies.

POST /api/v1/users/logout - Clears browser auth storage and cookies.

GET /api/v1/users/current-user - Hydrates client state with logged-in credentials.

# Videos & Dashboard

GET /api/v1/videos - Fetches paginated stream of published videos.

POST /api/v1/videos - Uploads high-res media files securely directly to Cloudinary.

GET /api/v1/dashboard - Consolidates channel statistics (Total Views, Likes, Subscriber Counts, and Upload History).

# Social Engagement

POST /api/v1/likes/toggle/video/:videoId - Idempotent toggle for liking/unliking videos.

POST /api/v1/subscriptions/c/:channelId - Subscribes or unsubscribes from a targeted content creator.

POST /api/v1/comments/:videoId - Post interactive commentary beneath streams.

Playlists & Micro-Blogging

POST /api/v1/playlists - Create customized audio-video playlists.

PATCH /api/v1/playlists/add/:videoId/:playlistId - Append content into a specific custom collection sequence.

POST /api/v1/tweets - Publishes a text-based status update.

# Search Engine

GET /api/v1/search/videos?q=query - Search database for titles or keywords.

GET /api/v1/search/users?q=query - Discover content creators by username handles.

## ⚙️ Environment Variables Setup
Create a .env file in your root backend directory:

Code snippet
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/videoplaystation
ACCESS_TOKEN_SECRET=your_ultra_secure_access_token_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_ultra_secure_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## 🏃‍♂️ Quick Start Setup

1. Clone & Install Dependencies
Bash
git clone [https://github.com/jsr-warrior-21/PulsePlay.git](https://github.com/jsr-warrior-21/PulsePlay.git)
cd PulsePlay
# Install backend engines
cd backend
npm install
2. Launch Development Servers
Bash
# Run server in hot-reload mode
npm run dev
The server will bind onto http://localhost:8000 while your Vite client listens on http://localhost:5173


    
