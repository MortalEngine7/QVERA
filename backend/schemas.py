from pydantic import BaseModel
from typing import Optional, List

class SessionCreate(BaseModel):
    qubit_count: int = 1024
    qber_threshold: float = 0.10
    eve_enabled: bool = False

class SessionResponse(BaseModel):
    session_id: str
    qubit_count: int
    sifted_key_length: Optional[int] = None
    compared_bit_count: Optional[int] = None
    qber: Optional[float] = None
    qber_threshold: float
    eve_enabled: bool
    security_status: str

    class Config:
        orm_mode = True

class QuantumRunRequest(BaseModel):
    session_id: str
    
class QuantumRunResponse(BaseModel):
    session_id: str
    security_status: str
    qber: float
    compared_bits: int
    errors: int
    eve_enabled: bool
    # Technical mode visual data
    alice_bits: Optional[List[int]] = None
    alice_bases: Optional[List[str]] = None
    bob_bases: Optional[List[str]] = None
    eve_bases: Optional[List[str]] = None
    eve_measurements: Optional[List[int]] = None

class TransferResponse(BaseModel):
    transfer_id: str
    session_id: str
    filename: str
    encryption_status: str
    transfer_status: str
    
class VerifyRequest(BaseModel):
    session_id: str
    transfer_id: str
