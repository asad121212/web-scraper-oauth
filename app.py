from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
from urllib.parse import urlparse
import urllib.robotparser

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from React frontend
CORS(app)

# --- Verify Google token ---
def verify_google_token(token):
    """
    Verifies the Google OAuth 2.0 ID token by calling Google's tokeninfo endpoint.
    Returns True if the token is valid, otherwise False.
    """
    if not token:
        return False  # If no token is provided, reject the request
    # Send a GET request to Google's OAuth token verification API
    response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
    return response.status_code == 200  # Valid token if status code is 200

# --- Check robots.txt ---
def is_allowed_by_robots(url):
    """
    Checks the website's robots.txt to determine if scraping is allowed.
    Returns True if scraping is permitted for the given URL, otherwise False.
    """
    try:
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(base_url)
        rp.read()
        return rp.can_fetch("*", url)
    except:
        return False  # Default to False if robots.txt cannot be read

# --- Web scraping function ---
def scrape_webpage(url):
    """
    Scrapes the given URL and extracts:
    - Page Title
    - First <h1> tag
    - Meta description
    Returns a dictionary with the extracted data or an error message.
    """
    headers = {'User-Agent': 'Mozilla/5.0'}  # Set User-Agent to mimic a browser
    response = requests.get(url, headers=headers)  # Fetch the webpage

    if response.status_code == 200:
        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract title if available
        title = soup.title.text.strip() if soup.title else None
        # Extract first H1 heading if available
        h1 = soup.find('h1').text.strip() if soup.find('h1') else None
        # Extract meta description if available
        meta_description = soup.find('meta', attrs={'name': 'description'})
        meta_description = meta_description['content'] if meta_description else None

        return {'title': title, 'h1': h1, 'meta_description': meta_description}
    else:
        # Return error if the webpage could not be retrieved
        return {"error": "Failed to retrieve webpage"}

# --- Scrape route ---
@app.route('/scrape', methods=["POST"])
def scrape():
    """
    API endpoint to handle scraping requests.
    Expects JSON with 'url' and 'token':
    - 'url' is the webpage to scrape
    - 'token' is the Google OAuth token to verify authentication
    """
    data = request.get_json()  # Get JSON data from request body
    url = data.get('url')
    token = data.get('token')

    # Verify Google OAuth token before allowing scraping
    if not verify_google_token(token):
        return jsonify({"error": "Invalid or missing token"}), 401

    # Check robots.txt before scraping
    if not is_allowed_by_robots(url):
        return jsonify({"error": "Scraping disallowed by robots.txt"}), 403

    # Perform scraping and return results as JSON
    return jsonify(scrape_webpage(url))

# Run the Flask app in debug mode when executed directly
if __name__ == '__main__':
    app.run(debug=True)
