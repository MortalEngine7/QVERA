from flask import Blueprint, request, jsonify
from database.session import SessionLocal
from database.models import SessionModel, SecurityEvent
from quantum.bb84 import run_bb84_simulation
from security.reconciliation import reconcile_bases
from security.qber import estimate_qber, verify_security
from security.key_derivation import derive_aes_key

in_memory_key_store = {}
quantum_bp = Blueprint('quantum', __name__)

@quantum_bp.route('/start', methods=['POST'])
def start_bb84():
    data = request.json or {}
    session_id = data.get('session_id')
    if not session_id:
        return jsonify({"detail": "Missing session_id"}), 400

    db = SessionLocal()
    try:
        db_session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
        if not db_session:
            return jsonify({"detail": "Not found"}), 404

        num_qubits = db_session.qubit_count
        eve_enabled = db_session.eve_enabled
        
        simulation_results = run_bb84_simulation(num_qubits, eve_enabled)
        
        db.add(SecurityEvent(session_id=session_id, event_type="BB84_COMPLETED", description=f"{num_qubits} qubits processed."))
        
        matching_indices, alice_sifted, bob_sifted = reconcile_bases(
            simulation_results["alice_bases"],
            simulation_results["bob_bases"],
            simulation_results["alice_bits"],
            simulation_results["bob_measurements"]
        )
        
        db.add(SecurityEvent(session_id=session_id, event_type="RECONCILIATION_COMPLETE", description=f"Basis reconciliation complete. Sifted {len(alice_sifted)} bits."))
        
        qber_stats = estimate_qber(alice_sifted, bob_sifted)
        db.add(SecurityEvent(session_id=session_id, event_type="QBER_CALCULATED", description=f"QBER calculated: {qber_stats['qber']*100:.2f}%"))
        
        is_secure = verify_security(qber_stats["qber"], db_session.qber_threshold)
        
        if is_secure:
            security_status = "PASSED"
            db.add(SecurityEvent(session_id=session_id, event_type="SECURITY_PASSED", description="Security check passed. Keys derived."))
            
            aes_key = derive_aes_key(alice_sifted, session_id=session_id)
            in_memory_key_store[session_id] = aes_key
        else:
            security_status = "FAILED"
            if eve_enabled:
                db.add(SecurityEvent(session_id=session_id, event_type="EVE_DETECTED", description="Simulated eavesdropper (Eve) actively intercepted communication."))
            db.add(SecurityEvent(session_id=session_id, event_type="SECURITY_FAILED", description="Security threshold exceeded. Shared key rejected. File transfer blocked."))
            
        db_session.sifted_key_length = len(alice_sifted)
        db_session.compared_bit_count = qber_stats['compared_bits']
        db_session.qber = qber_stats['qber']
        db_session.security_status = security_status
        
        db.commit()
        
        return jsonify({
            "session_id": session_id,
            "security_status": security_status,
            "qber": qber_stats['qber'],
            "compared_bits": qber_stats['compared_bits'],
            "errors": qber_stats['errors'],
            "eve_enabled": eve_enabled,
            "alice_bits": simulation_results["alice_bits"][:200],
            "alice_bases": simulation_results["alice_bases"][:200],
            "bob_bases": simulation_results["bob_bases"][:200],
            "eve_bases": simulation_results["eve_bases"][:200] if eve_enabled else None,
            "eve_measurements": simulation_results["eve_measurements"][:200] if eve_enabled else None
        })
    finally:
        db.close()
