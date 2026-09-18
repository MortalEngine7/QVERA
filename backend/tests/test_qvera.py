import pytest
import os
import io
import tempfile
from main import app
from database.session import init_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

@pytest.fixture
def temp_session(client):
    res = client.post("/api/session/create", json={
        "qubit_count": 1024,
        "qber_threshold": 0.10,
        "eve_enabled": False
    })
    return res.get_json()

def test_bb84_ideal(client, temp_session):
    res = client.post("/api/bb84/start", json={"session_id": temp_session["session_id"]})
    assert res.status_code == 200
    data = res.get_json()
    assert data["security_status"] == "PASSED"
    assert data["qber"] == 0.0

def test_bb84_eve(client):
    res = client.post("/api/session/create", json={
        "qubit_count": 1024,
        "qber_threshold": 0.10,
        "eve_enabled": True
    })
    session = res.get_json()
    
    res = client.post("/api/bb84/start", json={"session_id": session["session_id"]})
    data = res.get_json()
    assert data["security_status"] == "FAILED"
    assert data["qber"] > 0.10

def test_qber_rejection(client):
    res = client.post("/api/session/create", json={"qubit_count": 512, "qber_threshold": 0.02, "eve_enabled": True})
    sid = res.get_json()["session_id"]
    client.post("/api/bb84/start", json={"session_id": sid})
    
    data = {"session_id": sid}
    data["file"] = (io.BytesIO(b"Hello World"), 'test.txt')
    res_enc = client.post("/api/transfer/encrypt", data=data, content_type='multipart/form-data')
    assert res_enc.status_code == 403

def test_aes_round_trip_and_tampering(client, temp_session):
    res = client.post("/api/bb84/start", json={"session_id": temp_session["session_id"]})
    
    data = {"session_id": temp_session["session_id"]}
    file_bytes = b"Secret quantum data!"
    data["file"] = (io.BytesIO(file_bytes), 'test.txt')
    
    res_enc = client.post("/api/transfer/encrypt", data=data, content_type='multipart/form-data')
    assert res_enc.status_code == 200
    tid = res_enc.get_json()["transfer_id"]
    
    res_dec = client.post("/api/transfer/decrypt", json={"session_id": temp_session["session_id"], "transfer_id": tid})
    assert res_dec.status_code == 200
    assert res_dec.data == file_bytes
    
    client.post(f"/api/transfer/tamper/{tid}")
    
    res_tampered = client.post("/api/transfer/decrypt", json={"session_id": temp_session["session_id"], "transfer_id": tid})
    assert res_tampered.status_code == 400
    assert res_tampered.get_json()["detail"] == "INTEGRITY_FAILED"
