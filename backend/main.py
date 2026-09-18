from flask import Flask
from flask_cors import CORS
from database.session import init_db
import os
from dotenv import load_dotenv

from api.session import session_bp
from api.quantum import quantum_bp
from api.transfer import transfer_bp

load_dotenv()
app = Flask(__name__)

# Allow all origins to prevent dynamic local port blocking (e.g. 5174 instead of 5173)
CORS(app)

# Initialize database
with app.app_context():
    init_db()

# Register Blueprints
app.register_blueprint(session_bp, url_prefix='/api/session')
app.register_blueprint(quantum_bp, url_prefix='/api/bb84')
app.register_blueprint(transfer_bp, url_prefix='/api/transfer')

@app.route("/")
def read_root():
    return {"message": "QVERA API is running on Flask"}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
