import hashlib
import hmac
from typing import List

def hkdf_extract(salt: bytes, input_key_material: bytes) -> bytes:
    if salt is None or len(salt) == 0:
        salt = bytes([0] * hashlib.sha256().digest_size)
    return hmac.new(salt, input_key_material, hashlib.sha256).digest()

def hkdf_expand(prk: bytes, info: bytes, length: int) -> bytes:
    t = b""
    okm = b""
    i = 1
    while len(okm) < length:
        t = hmac.new(prk, t + info + bytes([i]), hashlib.sha256).digest()
        okm += t
        i += 1
    return okm[:length]

def derive_aes_key(sifted_key_bits: List[int], session_id: str = "qvera_session") -> bytes:
    """
    Converts BB84 bit array into bytes, then applies HKDF-SHA256 to
    generate a 256-bit (32 bytes) AES key.
    We only use the remaining bits (not used for QBER), but for simplicity
    we can use the entire valid sifted key or remaining portion.
    """
    # Convert list of ints to bytes
    # Pad to nearest byte
    bit_string = "".join(str(b) for b in sifted_key_bits)
    # Pad if not multiple of 8
    padding_len = (8 - len(bit_string) % 8) % 8
    bit_string += "0" * padding_len
    
    # Convert arbitrary length bit string to native bytes
    ikm = int(bit_string, 2).to_bytes(max(1, len(bit_string) // 8), byteorder='big')
    
    # HKDF-SHA256 Extract and Expand for robust key derivation
    # Use session_id as info
    prk = hkdf_extract(salt=b'qvera_salt', input_key_material=ikm)
    aes_key = hkdf_expand(prk, info=session_id.encode('utf-8'), length=32)
    
    return aes_key
