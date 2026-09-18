from flask import Blueprint, request, jsonify, send_file, Response
import uuid
import os
from database.session import SessionLocal
from database.models import SessionModel, TransferModel, SecurityEvent
from crypto.aes_gcm import encrypt_file_data, decrypt_file_data
from .quantum import in_memory_key_store
from dotenv import load_dotenv

load_dotenv()

transfer_bp = Blueprint('transfer', __name__)
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@transfer_bp.route('/encrypt', methods=['POST'])
def encrypt_and_store():
    session_id = request.form.get('session_id')
    file = request.files.get('file')
    
    if not session_id or not file:
        return jsonify({"detail": "Missing session_id or file"}), 400

    db = SessionLocal()
    try:
        db_session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
        if not db_session:
            return jsonify({"detail": "Session not found"}), 404
            
        if db_session.security_status != "PASSED":
            return jsonify({"detail": "Security check not passed, encryption blocked."}), 403
            
        aes_key = in_memory_key_store.get(session_id)
        if not aes_key:
            return jsonify({"detail": "AES key not found for this session."}), 500
            
        file_bytes = file.read()
        max_size_mb = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
        if len(file_bytes) > (max_size_mb * 1024 * 1024):
            return jsonify({"detail": f"File exceeds maximum allowed size of {max_size_mb}MB."}), 413
            
        ciphertext, nonce = encrypt_file_data(file_bytes, aes_key)
        encrypted_payload = nonce + ciphertext
        
        transfer_id = str(uuid.uuid4())
        save_path = os.path.join(UPLOAD_DIR, f"{transfer_id}.enc")
        
        with open(save_path, "wb") as f:
            f.write(encrypted_payload)
            
        transfer_rec = TransferModel(
            transfer_id=transfer_id,
            session_id=session_id,
            filename=file.filename,
            file_size=len(file_bytes),
            encryption_status="SUCCESS",
            transfer_status="READY"
        )
        
        db.add(transfer_rec)
        db.add(SecurityEvent(session_id=session_id, event_type="ENCRYPTION_COMPLETE", description=f"File '{file.filename}' encrypted using established AEAD AES-GCM key."))
        db.commit()
        
        return jsonify({
            "transfer_id": transfer_id,
            "session_id": session_id,
            "filename": file.filename,
            "encryption_status": "SUCCESS",
            "transfer_status": "READY"
        })
    finally:
        db.close()

@transfer_bp.route('/<transfer_id>/download', methods=['GET'])
def download_encrypted(transfer_id):
    db = SessionLocal()
    try:
        transfer_rec = db.query(TransferModel).filter(TransferModel.transfer_id == transfer_id).first()
        if not transfer_rec:
            return jsonify({"detail": "Transfer not found"}), 404
            
        save_path = os.path.join(UPLOAD_DIR, f"{transfer_id}.enc")
        if not os.path.exists(save_path):
            return jsonify({"detail": "Encrypted file payload missing on disk"}), 404
            
        transfer_rec.transfer_status = "TRANSFERRED"
        db.add(SecurityEvent(session_id=transfer_rec.session_id, event_type="SECURE_TRANSFER", description=f"Encrypted block transferred to recipient."))
        db.commit()
        
        return send_file(save_path, as_attachment=True, download_name=f"{transfer_rec.filename}.enc")
    finally:
        db.close()

@transfer_bp.route('/decrypt', methods=['POST'])
def decrypt_file():
    data = request.json or {}
    session_id = data.get('session_id')
    transfer_id = data.get('transfer_id')
    
    db = SessionLocal()
    try:
        transfer_rec = db.query(TransferModel).filter(TransferModel.transfer_id == transfer_id).first()
        if not transfer_rec:
            return jsonify({"detail": "Transfer not found"}), 404
            
        aes_key = in_memory_key_store.get(session_id)
        if not aes_key:
            return jsonify({"detail": "AES key not found for decryption."}), 500
            
        save_path = os.path.join(UPLOAD_DIR, f"{transfer_id}.enc")
        if not os.path.exists(save_path):
            return jsonify({"detail": "Encrypted payload missing"}), 404
            
        with open(save_path, "rb") as f:
            encrypted_payload = f.read()
            
        if len(encrypted_payload) < 12:
            return jsonify({"detail": "Invalid payload, too small"}), 400
            
        nonce = encrypted_payload[:12]
        ciphertext = encrypted_payload[12:]
        
        try:
            plaintext = decrypt_file_data(ciphertext, nonce, aes_key)
            
            transfer_rec.decryption_status = "SUCCESS"
            transfer_rec.integrity_status = "VERIFIED"
            db.add(SecurityEvent(session_id=session_id, event_type="INTEGRITY_VERIFIED", description="Authentication tag verified. File decryption successful."))
            db.commit()
            
            # Simulate local receiver destination directory writing
            dest_dir = os.path.join(UPLOAD_DIR, "received", session_id)
            os.makedirs(dest_dir, exist_ok=True)
            dest_path = os.path.join(dest_dir, transfer_rec.filename)
            with open(dest_path, "wb") as f_out:
                f_out.write(plaintext)
            
            db.add(SecurityEvent(session_id=session_id, event_type="FILE_WRITTEN", description=f"Verified payload materialized at backend receiver directory."))
            db.commit()
            
            # Flask response returning JSON regarding simulated local transfer
            return jsonify({
                "status": "decrypted",
                "integrity": "verified",
                "destination": dest_path,
                "filename": transfer_rec.filename,
                "download_url": f"/api/transfer/{transfer_id}/final_download"
            })
            
        except Exception as e:
            transfer_rec.decryption_status = "FAILED"
            transfer_rec.integrity_status = "REJECTED"
            db.add(SecurityEvent(session_id=session_id, event_type="INTEGRITY_FAILED", description="Authentication check failed. File integrity compromised. File rejected."))
            db.commit()
            return jsonify({"detail": "INTEGRITY_FAILED"}), 400
    finally:
        db.close()

@transfer_bp.route('/<transfer_id>/final_download', methods=['GET'])
def download_final(transfer_id):
    db = SessionLocal()
    try:
        transfer_rec = db.query(TransferModel).filter(TransferModel.transfer_id == transfer_id).first()
        if not transfer_rec:
            return jsonify({"detail": "Transfer not found"}), 404
        
        dest_path = os.path.join(UPLOAD_DIR, "received", transfer_rec.session_id, transfer_rec.filename)
        if not os.path.exists(dest_path):
            return jsonify({"detail": "Decrypted file not on disk"}), 404
            
        return send_file(dest_path, as_attachment=True, download_name=transfer_rec.filename)
    finally:
        db.close()

@transfer_bp.route('/tamper/<transfer_id>', methods=['POST'])
def tamper_file(transfer_id):
    save_path = os.path.join(UPLOAD_DIR, f"{transfer_id}.enc")
    if not os.path.exists(save_path):
        return jsonify({"detail": "Encrypted payload missing"}), 404
        
    with open(save_path, "rb") as f:
        data = bytearray(f.read())
        
    if len(data) > 20:
        data[20] = data[20] ^ 0xFF
    elif len(data) > 12:
        data[12] = data[12] ^ 0xFF
        
    with open(save_path, "wb") as f:
        f.write(data)
        
    return jsonify({"status": "tampered", "message": "Ciphertext modified"})
@transfer_bp.route('/history', methods=['GET'])
def get_history():
    db = SessionLocal()
    transfers = db.query(TransferModel).order_by(TransferModel.timestamp.desc()).all()
    history = []
    for t in transfers:
        session = db.query(SessionModel).filter(SessionModel.session_id == t.session_id).first()
        qber = (session.qber if session and session.qber else 0.0) * 100
        history.append({
            "id": t.transfer_id[:8],
            "name": t.filename,
            "size": t.file_size,
            "date": t.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "qber": round(qber, 2),
            "status": t.integrity_status if t.integrity_status != "PENDING" else t.transfer_status,
            "source": "Alice",
            "dest": "Bob",
            "enc": "Encrypted" if t.encryption_status == "SUCCESS" else "Blocked"
        })
    db.close()
    return jsonify({"history": history})

@transfer_bp.route('/stats', methods=['GET'])
def get_stats():
    db = SessionLocal()
    total = db.query(TransferModel).count()
    successful = db.query(TransferModel).filter(TransferModel.integrity_status == "VERIFIED").count()
    failed = db.query(TransferModel).filter(TransferModel.transfer_status == "FAILED").count()
    # Sessions that failed QBER aren't in TransferModel unless attempted, but let's count blocked from failed security checks
    blocked = db.query(SessionModel).filter(SessionModel.security_status == "FAILED").count()
    checks = db.query(SessionModel).count()
    db.close()
    
    return jsonify({
        "total": total,
        "successful": successful,
        "blocked": blocked + failed,
        "checks": checks
    })
