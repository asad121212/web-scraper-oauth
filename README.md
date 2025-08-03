Web Scraper with Google OAuth 2.0
A full-stack application that allows authenticated users to scrape metadata (Title, H1, Meta Description) from public websites, ensuring secure access and ethical scraping.

ReactJS (Frontend): Google OAuth login, responsive UI, animated design.

Flask (Backend): Token verification, robots.txt compliance, BeautifulSoup scraping.

Ready for deployment with environment variables and pinned dependencies.

Features
1. Secure Authentication
Google OAuth 2.0 implemented with @react-oauth/google and jwt-decode.

Tokens validated server-side using Google’s token verification API.

2. Ethical Web Scraping
Extracts page Title, first H1, and Meta Description.

Checks robots.txt before scraping.

Uses requests and BeautifulSoup4.

3. User-Friendly Frontend
Clean and responsive UI built with React + Vite.

Animated background and loading spinner.

Clear error handling for invalid URLs or restricted scraping.

Tech Stack
Frontend: React 19, Vite, Axios, @react-oauth/google, jwt-decode

Backend: Flask 3.1, Flask-CORS, Requests, BeautifulSoup4

Styling: Pure CSS (responsive design)

Project Structure
bash
Copy
Edit
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styling
│   │   ├── main.jsx       # Entry point with GoogleOAuthProvider
│   │   └── index.css      # Global styles
│   ├── package.json       # React dependencies
│   ├── .env               # Google Client ID (not committed to Git)
│   └── .gitignore
│
└── backend/
    ├── app.py             # Flask API
    └── requirements.txt   # Pinned backend dependencies

    
Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone <your-repo-link>
cd project-root
2. Backend Setup (Flask)
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
Backend runs at: http://127.0.0.1:5000

3. Frontend Setup (React + Vite)
bash
Copy
Edit
cd frontend
npm install
Create a .env file:
ini
Copy
Edit
VITE_GOOGLE_CLIENT_ID=your-google-client-id
Ensure main.jsx uses the environment variable:
javascript
Copy
Edit
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
Run the frontend:

bash
Copy
Edit
npm run dev
Frontend runs at: http://localhost:5173

Usage
Log in using Google OAuth.

Enter a website URL (e.g., https://example.com).

View scraped Title, H1, and Meta Description in a clean UI.

Deployment
Frontend: Netlify or Vercel.

Backend: Render, Railway, or AWS.

Update Flask CORS settings for production.

Future Enhancements
Scrape additional elements (images, links).

Save user-specific scrape history.

Implement pagination for large scrapes.