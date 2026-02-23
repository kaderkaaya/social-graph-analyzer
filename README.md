
# Social Graph Analyzer

A full-stack application that analyzes GitHub followers and following lists to detect non-reciprocal relationships at scale.

Built end-to-end with:

* Backend: Node.js + Express
* Frontend: Next.js
* HTTP Client: Axios
* Architecture: Layered and modular
* Comparison Strategy: Linear-time diff using `Set`


## Overview

“Who unfollowed me?” sounds simple.

But when an account has thousands of followers, solving it becomes an engineering challenge involving:

* GitHub API pagination (Link headers)
* Rate limiting
* Algorithmic efficiency
* Clean separation of concerns
* Frontend–backend contract stability

This project is built not as a quick script, but as a scalable, production-ready system.

## Architecture

### Backend (Node.js + Express)

The backend follows a clean layered structure:

```txt
backend/
├─ src/
│  ├─ controllers/
│  ├─ core/
│  ├─ helpers/
│  ├─ routes/
│  ├─ services/
│  └─ postman/
└─ index.js
```

#### Layer Responsibilities

* Routes: Endpoint definitions
* Controllers: Request/response boundary
* Services: Data orchestration
* Core: Pure comparison logic
* Helpers: GitHub client and pagination utilities

#### Comparison Strategy

Instead of a naive nested loop (O(n²)), the project uses JavaScript `Set` for efficient lookup, reducing the comparison complexity to O(n).
This ensures fast comparison even with thousands of users.


## Frontend (Next.js)

The frontend is built with Next.js and focuses on:

* Clean and responsive UI
* Clear visualization of comparison results
* Environment-based API configuration
* Structured rendering of:

  * notFollowingBack
  * notFollowedBack
  * User statistics

The frontend consumes the backend API and presents results in a simple, readable format.


## API

### POST `/github/compare`

#### Example Response

```json
{
  "message": "data fetched successfully",
  "data": {
    "result": {
      "username": "kaderkaaya",
      "counts": {
        "followersFetched": 37,
        "followingFetched": 34,
        "notFollowingBack": 3,
        "notFollowedBack": 6
      },
      "truncated": {
        "followers": false,
        "following": false
      },
      "result": {
        "notFollowingBack": ["example1", "example2", "example3"],
        "notFollowedBack": [
          "example4",
          "example5",
          "example6",
          "example7",
          "example8",
          "example9"
        ]
      }
    }
  }
}
```

#### Response Structure

* counts: statistical summary
* truncated: safety limit flags
* result: actual username arrays


## API Constraints Handling

* Personal Access Token (PAT) support
* Rate-limit aware design
* Configurable MAX_ITEMS
* Controlled pagination traversal


## Local Development

### 1. Clone

```bash
git clone https://github.com/your-username/social-graph-analyzer.git
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=3000
GITHUB_TOKEN=your_github_token
MAX_ITEMS=5000
```

Run:

```bash
node index.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3001`
Backend runs on `http://localhost:3000`


## Why This Project Matters

This project demonstrates:

* Real-world third-party API integration
* Correct pagination handling
* Rate-limit awareness
* Algorithmic optimization
* Clean modular architecture
* Full-stack integration


## Roadmap

* Background jobs for large accounts
* Queue-based worker architecture
* Redis caching
* Observability (metrics and logging)
* Persistent job results
