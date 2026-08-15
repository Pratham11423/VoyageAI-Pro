# VoyageAI Pro - Production-Ready MERN Stack AI Travel Planner

A full-stack, enterprise-level AI Travel Planner application built with **React.js (Vite)**, **React Router DOM**, **Node.js**, **Express.js**, **MongoDB Atlas**, **Mongoose**, **OpenAI API (GPT-4)**, **Google Maps Platform APIs**, and **Tailwind CSS**.

---

## 🌟 Overview & Features

VoyageAI Pro generates personalized, day-by-day travel itineraries customized to a user's destination, budget tier, travel group size, interests, accommodation style, and transportation preferences.

### Core Features
- 🤖 **AI-Powered Itinerary Engine**: Uses OpenAI GPT-4 (`json_object` enforcement) to build multi-day schedules with realistic timing, category badges, daily budgets, and local insider tips.
- 🗺️ **Interactive Destination Map**: Interactive Canvas/SVG & Google Maps Platform integration featuring colored pins for Hotels, Restaurants, Sights, and route path visualizations.
- 🏨 **Hotel & Restaurant Discovery**: Handpicked hotel options matched to budget tiers along with regional culinary hotspots and signature dishes.
- 💵 **Cost Estimation & Budget Breakdown**: Categorized expense breakdowns (Hotels, Dining, Transport, Sights, Shopping) with daily spend metrics.
- 🧳 **Local Travel Tips & Interactive Packing List**: Weather outlook, cultural etiquette rules, tipping customs, and checkable packing lists.
- 🔐 **JWT Authentication & Security**: Password hashing with `bcryptjs`, signed JWT tokens, and CORS, Helmet, Rate limiter protection.
- 💾 **Complete Trip Management**: Save, edit, favorite, duplicate, delete, and search trips in MongoDB via Mongoose.
- 📱 **Responsive Modern Dashboard**: Dark mode UI, mobile drawer sidebar, loading skeletons, and celebration confetti.

---

## 🏗️ Architecture & Planning Workflow

```text
User Enters Destination & Preferences
        ↓
Geocoding API / Nominatim
        ↓
Places API (Hotels, Dining, Attractions)
        ↓
System Prompt Construction (JSON Schema Constraints)
        ↓
OpenAI GPT-4 Completion Model
        ↓
Parse & Validate Structured Output
        ↓
Interactive Itinerary & Map View
        ↓
Save Trip in MongoDB (Mongoose ORM)
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM, Vite, Tailwind CSS v4, Axios, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js REST APIs
- **Database**: MongoDB Atlas with Mongoose
- **AI**: OpenAI API (`gpt-4o-mini` / `gpt-4o`)
- **Maps**: Google Maps Platform APIs (Places, Geocoding, Maps JS) & OpenStreetMap fallback
- **Auth**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Security & Logging**: Helmet, CORS, Express Rate Limit, Winston Logger, Morgan HTTP logger

---

## 🚀 Installation & Running

### Prerequisites
- Node.js installed
- MongoDB connection string (Atlas or Local)

### Setup Environment
Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-travel-planner?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
```

### Installation
Run the following command in the root folder to install dependencies for both the frontend (client) and backend (server):

```bash
npm run install-all
```

### Running Locally
To launch both servers in development mode:

1. Start the Express server:
   ```bash
   npm run server
   ```
2. Start the Vite client:
   ```bash
   npm run client
   ```

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account & issue JWT
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Fetch profile & user preferences
- `PUT /api/auth/profile` - Update profile & preferences
- `POST /api/auth/profile/avatar` - Upload profile avatar image
- `POST /api/auth/logout` - Clear auth session

### AI Planning
- `POST /api/ai/generate-trip` - Generate structured AI travel plan

### Trips
- `GET /api/trips` - Retrieve user's saved trips
- `POST /api/trips` - Save new trip to account
- `GET /api/trips/:id` - Fetch single trip details
- `PUT /api/trips/:id` - Update trip details or favorite status
- `DELETE /api/trips/:id` - Delete saved trip
- `POST /api/trips/:id/duplicate` - Duplicate existing trip

### Maps & Places Proxy
- `GET /api/maps/search` - Autocomplete place search
- `GET /api/maps/places` - Retrieve nearby attractions
- `GET /api/maps/hotels` - Retrieve nearby accommodation

---

## 🔒 Security & Logging

1. **Password Security**: Passwords hashed with `bcryptjs` (10 salt rounds).
2. **Session Security**: JWT tokens signed and transmitted securely.
3. **Winston Logging**: Error logs and general server transactions written to `/logs/error.log` and `/logs/combined.log`.
4. **API Limiting**: Protects backend routes against brute force attacks.
