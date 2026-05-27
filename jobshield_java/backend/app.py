from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# Store reports
reports = []

# Trusted job websites
trusted_sites = ["naukri.com", "linkedin.com", "indeed.com", "glassdoor.com"]


# ---------------- LOGIN ----------------

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email == "admin@gmail.com" and password == "1234":
        return jsonify({"message": "Login Successful"})
    else:
        return jsonify({"message": "Invalid Email or Password"})


# ---------------- ANALYZE JOB URL ---------------
@app.route("/analyze", methods=["POST"])

def analyze():
    data = request.json
    url = data.get("url")   # ✅ yahan define hua

    # 🔥 TEST CODE
    return jsonify({
        "title": "TESTING",
        "url": url,
        "domain": "test",
        "risk": "LOW",
        "trust_score": 0,
        "date": datetime.now().strftime("%d %B %Y")
    })

    data = request.json
    url = data.get("url")

    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)

        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.string if soup.title else "No Title Found"

        text = response.text.lower()

        # ✅ Domain clean karo
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()

        if domain.startswith("www."):
            domain = domain.replace("www.", "")

        # DEFAULT
        risk = "LOW"
        trust_score = 90

        # 🔐 TRUSTED SITES → FORCE 100% + RETURN (IMPORTANT)
        if any(domain.endswith(site) for site in trusted_sites):
            risk = "LOW"
            trust_score = 100

            result = {
                "title": title,
                "url": url,
                "domain": domain,
                "risk": risk,
                "trust_score": trust_score,
                "date": datetime.now().strftime("%d %B %Y")
            }

            reports.append(result)
            return jsonify(result)   # 👈 yahin stop ho jayega

        # ❗ BELOW LOGIC ONLY FOR NON-TRUSTED SITES

        # HIGH RISK
        if any(word in text for word in ["pay fee", "registration fee", "money transfer", "pay upfront"]):
            risk = "HIGH"
            trust_score = 30

        # MEDIUM RISK
        elif any(word in text for word in ["urgent hiring", "limited seats", "earn quickly"]):
            risk = "MEDIUM"
            trust_score = 60

        # SAFE (salary normal hai)
        pass   # salary ko ignore kar do

        result = {
            "title": title,
            "url": url,
            "domain": domain,
            "risk": risk,
            "trust_score": trust_score,
            "date": datetime.now().strftime("%d %B %Y")
        }

        reports.append(result)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": "Unable to analyze URL",
            "details": str(e)
        })


# ---------------- SAVE REPORT ----------------

@app.route("/save-report", methods=["POST"])
def save_report():
    data = request.json
    reports.append(data)
    return jsonify({"message": "Report Saved"})

# ---------------- GET REPORTS ----------------

@app.route("/get-reports", methods=["GET"])
def get_reports():
    return jsonify(reports)

# ---------------- RUN APP ----------------

if __name__ == "__main__":
    app.run(debug=True)