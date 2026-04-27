# ============================================================
# app.py — Flask Backend Server
#
# 📚 LESSON: What is a Server / API?
#
# A SERVER is a computer that listens for requests and sends back responses.
# Think of it like a restaurant:
#   - You (browser/frontend) = customer
#   - Waiter = the API (takes your order)
#   - Kitchen = the server code (processes and prepares)
#   - Food = the response (data sent back to you)
#
# API = Application Programming Interface
# It's a set of rules for HOW the frontend sends requests
# and HOW the backend sends responses.
#
# We communicate using JSON (JavaScript Object Notation)
# JSON looks like this: {"name": "Arjun", "age": 16}
# It's a universal language that all computers understand.
#
# 📚 FLASK is a Python web framework.
# It makes building servers very easy.
# ============================================================

# Import Flask and helper tools
# 'from X import Y' means: from library X, only load Y
from flask import Flask, request, jsonify
from flask_cors import CORS          # Allows frontend to talk to backend
from dotenv import load_dotenv       # Loads .env file (secret settings)
import os                            # For environment variables
import json                          # For working with JSON data
from datetime import datetime        # For timestamps

# Load environment variables from .env file
# 📚 .env files store SECRET settings we don't want in code
#    Example: API keys, database passwords, etc.
load_dotenv()

# ──────────────────────────────────────────────────────
# CREATE THE FLASK APP
# ──────────────────────────────────────────────────────

# Flask(__name__) creates the web server
# __name__ tells Flask where to find templates and files
app = Flask(__name__)

# CORS = Cross-Origin Resource Sharing
# 📚 By default, browsers BLOCK requests from a different origin.
# For example, your frontend at localhost:3000 can't talk to
# your backend at localhost:5000 — security block!
# CORS(app) "opens" the door and allows this.
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500", "*"])

# ──────────────────────────────────────────────────────
# IMPORT OUR CAREER LOGIC
# ──────────────────────────────────────────────────────
from career_logic import analyze_career, get_career_resources

# ──────────────────────────────────────────────────────
# ROUTES (API Endpoints)
# 📚 A route is a URL that does something.
# @app.route('/analyze') means: when someone visits /analyze, run this function
# ──────────────────────────────────────────────────────

@app.route('/', methods=['GET'])
def home():
    """
    Root route — just confirms the server is running.
    📚 This is like a "Hello, I'm alive!" message.
    """
    return jsonify({
        'status': 'running',
        'message': '🌸 Ikigai for Teens API is running!',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/analyze': 'Analyze career from assessment answers',
            'POST /api/contact': 'Submit contact form',
            'GET /api/careers': 'Get all available careers',
            'GET /api/health': 'Health check'
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint — used by hosting platforms to verify server is alive.
    """
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    POST /api/analyze

    📚 LESSON: POST vs GET
    - GET: asks the server for data (like opening a webpage)
    - POST: sends data TO the server for it to process
    
    This endpoint:
    1. Receives JSON data from the frontend
    2. Validates/sanitizes the input (SECURITY!)
    3. Runs our career analysis logic
    4. Returns personalized career recommendations

    Request body (JSON):
    {
        "userName": "Arjun",
        "userAge": "16",
        "answers": {
            "p1_interest": "maker",
            "p1_school": "stem",
            ...
        }
    }
    """
    
    # 📚 request.get_json() reads the JSON body sent by the frontend
    # force=True means: even if Content-Type header isn't set, try to parse JSON
    data = request.get_json(force=True)
    
    # ── INPUT VALIDATION (SECURITY STEP 1) ──
    # 📚 NEVER trust user input! Always validate it.
    # Attackers could send malicious data to break your server.
    if not data:
        return jsonify({
            'error': 'No data received',
            'message': 'Please send valid JSON data.'
        }), 400  # 400 = Bad Request
    
    # Validate required fields
    required_fields = ['answers']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': f'Missing required field: {field}'
            }), 400

    # ── SANITIZE INPUT (SECURITY STEP 2) ──
    # 📚 Sanitization = cleaning user input to remove harmful content
    user_name = sanitize_text(data.get('userName', 'Friend'))
    user_age = data.get('userAge', '16')
    answers = data.get('answers', {})

    # Validate answers is a dictionary
    if not isinstance(answers, dict):
        return jsonify({'error': 'answers must be an object'}), 400

    # Validate answers don't contain weird values
    for key, value in answers.items():
        if not isinstance(key, str) or len(key) > 50:
            return jsonify({'error': 'Invalid answer key'}), 400

    # ── PROCESS (Run Career Analysis) ──
    try:
        result = analyze_career(user_name, user_age, answers)
        
        # Log the request (in production, use proper logging)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Analysis for {user_name}, age {user_age} — {len(result['careers'])} careers matched")
        
        # Return success response
        # 📚 jsonify() converts Python dict → JSON string
        # 200 = HTTP status code meaning "Success"
        return jsonify({
            'success': True,
            'data': result
        }), 200

    except Exception as e:
        # If something goes wrong, return a helpful error
        # 📚 500 = Internal Server Error
        print(f"Error in analyze: {e}")
        return jsonify({
            'success': False,
            'error': 'Analysis failed. Please try again.'
        }), 500


@app.route('/api/contact', methods=['POST'])
def contact():
    """
    POST /api/contact
    
    Handles contact form submissions.
    In a real app, this would send an email.
    For now, it validates and logs the message.
    """
    data = request.get_json(force=True)
    
    if not data:
        return jsonify({'error': 'No data received'}), 400

    # Validate required contact fields
    required = ['name', 'email', 'message']
    for field in required:
        if not data.get(field, '').strip():
            return jsonify({'error': f'{field} is required'}), 400

    # Basic email validation
    email = data.get('email', '')
    if '@' not in email or '.' not in email.split('@')[-1]:
        return jsonify({'error': 'Invalid email address'}), 400

    # In production: send email here using smtplib or SendGrid
    # For now, just log it
    print(f"\n📬 New Contact Message:")
    print(f"   From: {sanitize_text(data['name'])} <{email}>")
    print(f"   Subject: {data.get('subject', 'General')}")
    print(f"   Message: {sanitize_text(data['message'])[:100]}...")

    return jsonify({
        'success': True,
        'message': f"Thank you {data['name']}! We'll get back to you within 24 hours."
    }), 200


@app.route('/api/careers', methods=['GET'])
def get_all_careers():
    """
    GET /api/careers
    
    Returns all available career paths.
    Frontend can use this to populate UI without hardcoding.
    """
    from career_logic import CAREER_DATABASE
    
    # Only return safe/needed fields (not internal scoring data)
    careers = [{
        'id': c['id'],
        'title': c['title'],
        'emoji': c['emoji'],
        'category': c['category'],
        'desc': c['desc'],
        'salary': c['salary'],
        'growth': c['growth'],
    } for c in CAREER_DATABASE]

    return jsonify({
        'success': True,
        'count': len(careers),
        'data': careers
    }), 200


# ──────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ──────────────────────────────────────────────────────

def sanitize_text(text):
    """
    📚 Sanitization: Remove potentially dangerous characters from user input.
    This prevents XSS (Cross-Site Scripting) attacks.
    
    XSS attack example: user enters "<script>steal_cookies()</script>" as their name
    Without sanitization, this could run as code!
    """
    if not isinstance(text, str):
        return ''
    
    # Remove HTML tags (very simple sanitization)
    # In production, use a library like 'bleach'
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '{', '}']
    cleaned = text
    for char in dangerous_chars:
        cleaned = cleaned.replace(char, '')
    
    # Limit length
    return cleaned[:200].strip()


# ──────────────────────────────────────────────────────
# ERROR HANDLERS
# 📚 These run if something goes wrong with any request
# ──────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The API endpoint you requested does not exist.'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed',
        'message': 'You used the wrong HTTP method (GET/POST) for this endpoint.'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong on our end. Please try again.'
    }), 500


# ──────────────────────────────────────────────────────
# RUN THE SERVER
# 📚 This block only runs when you execute: python app.py
#    It does NOT run when this file is imported by another file.
# ──────────────────────────────────────────────────────

if __name__ == '__main__':
    # Get config from environment variables (with fallback defaults)
    PORT = int(os.getenv('PORT', 5000))       # Default port = 5000
    DEBUG = os.getenv('DEBUG', 'True') == 'True'  # Debug shows errors
    
    print(f"""
    🌸 ══════════════════════════════════════
       Ikigai for Teens — Backend Server
    ══════════════════════════════════════════
    ✅ Server running at: http://localhost:{PORT}
    🛠️  Debug mode: {DEBUG}
    📋 Endpoints available:
       GET  /              → Server info
       GET  /api/health    → Health check
       POST /api/analyze   → Career analysis
       POST /api/contact   → Contact form
       GET  /api/careers   → All careers
    ══════════════════════════════════════════
    """)
    
    app.run(
        host='0.0.0.0',    # Listen on all network interfaces
        port=PORT,
        debug=DEBUG        # Auto-reload on code changes
    )
