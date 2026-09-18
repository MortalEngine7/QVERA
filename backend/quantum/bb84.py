from typing import Dict, List, Any
from .constants import Basis
from .alice import Alice
from .bob import Bob
from .eve import Eve

def run_bb84_simulation(num_qubits: int = 1024, eve_enabled: bool = False) -> Dict[str, Any]:
    # Initialize participants
    alice = Alice(num_qubits)
    bob = Bob(num_qubits)
    
    # Alice prepares states
    transmitted_states = alice.prepare()
    
    # Optional Eve intervention
    eve_bases = []
    eve_measurements = []
    if eve_enabled:
        eve = Eve()
        transmitted_states = eve.intercept_and_resend(transmitted_states)
        eve_bases = [b.value for b in eve.bases]
        eve_measurements = eve.measurements
        
    # Bob receives and measures
    bob.process(transmitted_states)
    
    return {
        "num_qubits": num_qubits,
        "eve_enabled": eve_enabled,
        "alice_bits": alice.bits,
        "alice_bases": [b.value for b in alice.bases],
        "alice_states": [s.value for s in alice.states],
        "eve_bases": eve_bases,
        "eve_measurements": eve_measurements,
        "bob_bases": [b.value for b in bob.bases],
        "bob_measurements": bob.measurements
    }
