import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Please log in to use the scraper.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    setData(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/scrape", { url, token });
      setData(response.data);
    } catch (error) {
      setErrorMessage("Error scraping the site. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setData(null);
    setUrl("");
    setUserName("");
    setErrorMessage("");
  };

  const handleLoginSuccess = (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error("No credential found");
      return;
    }

    const token = credentialResponse.credential;
    setToken(token);

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
    } catch (err) {
      console.error("Failed to decode token", err);
      setUserName("User");
    }
  };

  return (
    <div className="app-container">
      <div className="foreground-text">SCRAPER</div>
      <div className="card">
        {token && (
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        )}

        <h1 className="heading">Web Scraper</h1>

        {!token ? (
          <div className="login-container">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        ) : (
          <p className="status-text">Hi, {userName}</p>
        )}

        <form onSubmit={handleSubmit} className="scrape-form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="scrape-input"
          />
          <button type="submit" className="scrape-button">
            Scrape
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {loading && (
          <div className="spinner">
            <div className="spinner-circle"></div>
          </div>
        )}

        {data && (
          <div className="data-card">
            <h2>Scraped Data</h2>
            <div>
              <strong>Title:</strong>
              <p>{data.title || "Not found"}</p>
            </div>
            <div>
              <strong>H1:</strong>
              <p>{data.h1 || "Not found"}</p>
            </div>
            <div>
              <strong>Meta Description:</strong>
              <p>{data.meta_description || "Not found"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
