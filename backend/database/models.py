from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class SessionModel(Base):
    __tablename__ = "sessions"
    
    session_id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    qubit_count = Column(Integer, default=1024)
    sifted_key_length = Column(Integer, nullable=True)
    compared_bit_count = Column(Integer, nullable=True)
    qber = Column(Float, nullable=True)
    qber_threshold = Column(Float, default=0.10)
    eve_enabled = Column(Boolean, default=False)
    security_status = Column(String, default="INITIALIZING")  # e.g., PASSED, FAILED, INITIALIZING

class TransferModel(Base):
    __tablename__ = "transfers"
    
    transfer_id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    filename = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    encryption_status = Column(String, default="PENDING")
    transfer_status = Column(String, default="PENDING")
    decryption_status = Column(String, default="PENDING")
    integrity_status = Column(String, default="PENDING")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SecurityEvent(Base):
    __tablename__ = "security_events"
    
    event_id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    event_type = Column(String, nullable=False)
    qber = Column(Float, nullable=True)
    description = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
