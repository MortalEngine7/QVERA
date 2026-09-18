from typing import List, Dict, Any

def estimate_qber(alice_sifted: List[int], bob_sifted: List[int], sample_size_ratio: float = 0.5) -> Dict[str, Any]:
    """
    Estimates Quantum Bit Error Rate (QBER) by comparing a subset of the sifted key.
    For this simulation, we can just use the entire sifted key or a subset.
    Default takes 50% for sample to mimic taking a subset for validation.
    """
    if not alice_sifted:
        return {"qber": 0.0, "compared_bits": 0, "errors": 0}
        
    num_compare = max(1, int(len(alice_sifted) * sample_size_ratio))
    
    # In a real protocol, Alice and Bob exchange a random subset of indices.
    # Here we simulate by just taking the first `num_compare` bits. 
    # (Or randomly sample theoretically, but picking first N is fine for this demo)
    
    alice_sample = alice_sifted[:num_compare]
    bob_sample = bob_sifted[:num_compare]
    
    errors = sum(1 for a, b in zip(alice_sample, bob_sample) if a != b)
    qber = (errors / num_compare) if num_compare > 0 else 0.0
    
    return {
        "qber": qber,
        "compared_bits": num_compare,
        "errors": errors
    }

def verify_security(qber: float, threshold: float = 0.10) -> bool:
    """
    Security decision based on threshold (e.g. 10%).
    Returns True if valid (QBER <= threshold), False if invalid.
    """
    return qber <= threshold
