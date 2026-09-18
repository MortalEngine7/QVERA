from typing import List, Tuple

def reconcile_bases(alice_bases: List[str], bob_bases: List[str], 
                   alice_bits: List[int], bob_measurements: List[int]) -> Tuple[List[int], List[int], List[int]]:
    """
    Returns (matching_indices, alice_sifted_key, bob_sifted_key).
    Only elements where Alice and Bob used the same basis are kept.
    """
    matching_indices = []
    alice_sifted = []
    bob_sifted = []
    
    for i in range(len(alice_bases)):
        if alice_bases[i] == bob_bases[i]:
            matching_indices.append(i)
            alice_sifted.append(alice_bits[i])
            bob_sifted.append(bob_measurements[i])
            
    return matching_indices, alice_sifted, bob_sifted
