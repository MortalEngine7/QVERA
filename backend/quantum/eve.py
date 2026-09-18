import secrets
from typing import List
from .constants import Basis, QuantumState

class Eve:
    def __init__(self):
        self.bases: List[Basis] = []
        self.measurements: List[int] = []
        self.output_states: List[QuantumState] = []

    def intercept_and_resend(self, incoming_states: List[QuantumState]) -> List[QuantumState]:
        self.bases = []
        self.measurements = []
        self.output_states = []
        
        for state in incoming_states:
            # Eve randomly selects a basis
            chosen_basis = Basis.Z if secrets.randbelow(2) == 0 else Basis.X
            self.bases.append(chosen_basis)
            
            # Eve measures the state
            if chosen_basis == Basis.Z:
                if state == QuantumState.ZERO:
                    result = 0
                elif state == QuantumState.ONE:
                    result = 1
                else:
                    result = secrets.randbits(1)
                
                # Eve prepares a new state based on her measurement
                new_state = QuantumState.ZERO if result == 0 else QuantumState.ONE
                    
            else: # Basis.X
                if state == QuantumState.PLUS:
                    result = 0
                elif state == QuantumState.MINUS:
                    result = 1
                else:
                    result = secrets.randbits(1)
                    
                # Eve prepares a new state based on her measurement
                new_state = QuantumState.PLUS if result == 0 else QuantumState.MINUS

            self.measurements.append(result)
            self.output_states.append(new_state)
            
        return self.output_states
