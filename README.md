# AromaRate - Premium Cafe Ratings Portal

AromaRate is a community hub designed for local neighborhood outreach where cafe store owners list shops, administrators manage registrations, and customers search, explore, and review their favorite specialty coffees.

The portal features a warm light-coffee design system matching the homepage's aesthetic.

---

## ☕ Key Features

### 1. Minimal Coffee Directory
- Browse registered local coffee cups and cafes.
- Search dynamically by cafe name and location.
- Sort cards instantly by average ratings (highest or lowest first).

### 2. Cohesive Cafe Details
- **Breadcrumbs**: Navigate easily through Satara > Pizza Outlets > Wai City paths.
- **Photo Grid**: Responsive layouts showing interior, exterior, and coffee shots with a simulated "Add Photo" handler.
- **Timings Dropdown**: A dropdown weekly schedule showing operating hours.
- **Actions Bar**: Actionable links for Phone, WhatsApp, and "Ask Anything" (Beta).
- **Ask Anything AI Widget**: A simulated AI assistant that answers questions about menus, home deliveries, vegetarian options, timings, and workspace amenities.
- **Reviews & Ratings**: Displays overall scores, recent rating trends, and a chronologically sortable review feed showing rater names, ratings, timestamps, and comments.
- **Floating Footer**: A sticky toolbar at the bottom of the screen on scroll for quick access to actions.

### 3. Star Ratings & Review Comments
- Submit new ratings or update existing ones.
- Add written review text comments saved securely in the MySQL database.
- Global Error Boundary setup to prevent React runtime exceptions.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), CSS Custom properties, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MySQL (using connection pooling), JSON Web Tokens (JWT) authentication.

---

## 💻 Quick Start & Setup

### 1. Prerequisites
- Node.js installed on your machine.
- MySQL Server running locally.

### 2. Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` configuration (ignored by Git):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=cafe_rating_db
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *Note: Database tables and seed accounts are initialized automatically on startup.*

### 3. Frontend Installation
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Setup Seed Accounts
The database automatically seeds test accounts for development. Check `backend/utils/dbInit.js` to view or customize default development accounts and credentials.
