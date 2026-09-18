import os
from typing import Tuple, Dict, Any
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def encrypt_file_data(plaintext: bytes, key: bytes, metadata_associated_data: bytes = b"") -> Tuple[bytes, bytes]:
    """
    Encrypts data using AES-256-GCM.
    Returns (ciphertext, nonce).
    GCM implicitly appends the 16-byte authentication tag to the ciphertext 
    in the `cryptography` library implementation.
    """
    aesgcm = AESGCM(key)
    # Generate 12-byte (96-bit) unique nonce for GCM
    nonce = os.urandom(12) 
    
    # Encrypt
    ciphertext = aesgcm.encrypt(nonce, plaintext, metadata_associated_data)
    
    return ciphertext, nonce

def decrypt_file_data(ciphertext: bytes, nonce: bytes, key: bytes, metadata_associated_data: bytes = b"") -> bytes:
    """
    Decrypts AES-256-GCM ciphertext data.
    Will raise `cryptography.exceptions.InvalidTag` if authentication fails
    (file was tampered with or modified).
    """
    aesgcm = AESGCM(key)
    try:
        plaintext = aesgcm.decrypt(nonce, ciphertext, metadata_associated_data)
        return plaintext
    except Exception as e:
        # Re-raise standard exception for higher layer to catch authentication failures
        raise Exception("AUTHENTICATION_FAILED") from e
