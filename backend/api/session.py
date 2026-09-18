from flask import Blueprint, request, jsonify
import uuid
from database.session import SessionLocal
from database.models import SessionModel, SecurityEvent

session_bp = Blueprint('session', __name__)

@session_bp.route('/create', methods=['POST'])
def create_session():
    data = request.json or {}
    qubit_count = data.get('qubit_count', 1024)
    qber_threshold = data.get('qber_threshold', 0.10)
    eve_enabled = data.get('eve_enabled', False)

    session_id = str(uuid.uuid4())
    db = SessionLocal()
    try:
        db_session = SessionModel(
            session_id=session_id,
            qubit_count=qubit_count,
            qber_threshold=qber_threshold,
            eve_enabled=eve_enabled,
            security_status="INITIALIZING"
        )
        
        event = SecurityEvent(
            session_id=session_id,
            event_type="SESSION_CREATED",
            description=f"Secure session started with {qubit_count} qubits."
        )
        
        db.add(db_session)
        db.add(event)
        db.commit()
        
        return jsonify({
            "session_id": session_id,
            "qubit_count": qubit_count,
            "qber_threshold": qber_threshold,
            "eve_enabled": eve_enabled,
            "security_status": "INITIALIZING"
        })
    finally:
        db.close()

@session_bp.route('/<session_id>', methods=['GET'])
def get_session(session_id):
    db = SessionLocal()
    try:
        s = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
        if not s:
            return jsonify({"detail": "Not found"}), 404
        return jsonify({
            "session_id": s.session_id,
            "qubit_count": s.qubit_count,
            "sifted_key_length": s.sifted_key_length,
            "compared_bit_count": s.compared_bit_count,
            "qber": s.qber,
            "qber_threshold": s.qber_threshold,
            "eve_enabled": s.eve_enabled,
            "security_status": s.security_status
        })
    finally:
        db.close()

@session_bp.route('/<session_id>/events', methods=['GET'])
def get_events(session_id):
    db = SessionLocal()
    try:
        events = db.query(SecurityEvent).filter(SecurityEvent.session_id == session_id).order_by(SecurityEvent.timestamp).all()
        return jsonify([{
            "event_type": e.event_type,
            "description": e.description,
            "timestamp": e.timestamp.isoformat()
        } for e in events])
    finally:
        db.close()
