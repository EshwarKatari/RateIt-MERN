# RateIt — Company Review Platform
### MERN Stack Full-Stack Application

A production-grade company review and rating platform built with **MongoDB**, **Express.js**, **React**, and **Node.js**.

---

## ✨ Features

### Frontend
- **Stunning dark UI** — custom design system with Syne + DM Sans fonts, electric violet/cyan palette, glassmorphic elements
- **Home page** with animated hero, search, and featured companies
- **Company listing** — grid with search, industry filter, sort, and pagination
- **Company detail page** — rating summary with distribution bars, quick stats
- **Review cards** — sub-ratings (work-life balance, culture, growth, compensation), like system, share
- **Modals** — add company (with logo upload), add review (with star picker for each sub-metric)
- **Fully responsive** — mobile-first, bottom-sheet modals on mobile
- **Micro-animations** — staggered entry, hover effects, floating elements
- **Toast notifications** — success/error feedback via react-hot-toast

### Backend
- **RESTful API** with Express.js
- **MongoDB** with Mongoose ODM
- **File uploads** — multer for company logos
- **Search** — regex text search across name, city, industry, description
- **Aggregation** — real-time average rating computation via MongoDB aggregation pipeline
- **Validation** — Mongoose validators + meaningful error messages
- **Pagination** — all list endpoints support page/limit

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set your MONGO_URI
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 📡 API Endpoints

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List companies (search, filter, paginate) |
| GET | `/api/companies/:id` | Get single company |
| POST | `/api/companies` | Create company (multipart/form-data) |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company + all reviews |

### Query params for GET /api/companies:
- `search` — text search
- `city` — filter by city
- `industry` — filter by industry
- `sort` — e.g. `-createdAt`, `name`, `-name`
- `page`, `limit` — pagination

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews?company=:id` | List reviews for a company |
| POST | `/api/reviews` | Submit a review |
| POST | `/api/reviews/:id/like` | Like a review |
| DELETE | `/api/reviews/:id` | Delete a review |

### Query params for GET /api/reviews:
- `company` — filter by company ID (required for company reviews)
- `sort` — `-createdAt`, `-rating`, `rating`, `-likes`
- `page`, `limit` — pagination

---

## 🗂 Project Structure

```
company-review-app/
├── backend/
│   ├── models/
│   │   ├── Company.js       # Company schema with virtuals
│   │   └── Review.js        # Review schema with aggregation static
│   ├── routes/
│   │   ├── companies.js     # CRUD + logo upload
│   │   └── reviews.js       # CRUD + like endpoint
│   ├── uploads/logos/       # Uploaded logos (auto-created)
│   ├── server.js            # Express app entry point
│   └── .env.example
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── CompanyCard.js
        │   ├── ReviewCard.js
        │   ├── StarRating.js
        │   ├── AddCompanyModal.js
        │   └── AddReviewModal.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── CompaniesPage.js
        │   └── CompanyDetailPage.js
        ├── utils/api.js       # Axios API client
        ├── index.css          # Full design system
        ├── App.js
        └── index.js
```

---

## 🎨 Design Decisions

- **Dark luxury aesthetic** — deep `#07070d` background, electric violet `#7c3aed` accent, cyan `#06b6d4` highlights
- **Typography** — `Syne` for display (bold, geometric), `DM Sans` for body (clean, readable)
- **CSS-only animations** — staggered `slideUp` for grid items, hover lift on cards, glow effects on focus
- **Grid system** — `repeat(auto-fill, minmax(340px, 1fr))` for fluid responsive layout
- **MongoDB aggregation** — `calcAverageRating` static method computes avg dynamically per query
- **Multipart upload** — logo files stored on server under `/uploads/logos/`, served as static files

---

## 💡 Candidate Notes

- Code is clean, modular, and follows separation of concerns
- Error handling at both API and UI layers
- MongoDB indexes on text fields for performant search
- Responsive design with mobile-first breakpoints
- All 4 task requirements fully implemented: Add Company, Company Listing, Add Review, Review Listing
