import secrets
from typing import List
from .constants import Basis, QuantumState

class Bob:
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.bases: List[Basis] = []
        self.measurements: List[int] = []

    def generate_random_bases(self) -> List[Basis]:
        self.bases = [Basis.Z if secrets.randbelow(2) == 0 else Basis.X for _ in range(self.num_qubits)]
        return self.bases

    def measure_states(self, incoming_states: List[QuantumState]) -> List[int]:
        self.measurements = []
        for state, basis in zip(incoming_states, self.bases):
            # Simulated measurement based on basis matching
            if basis == Basis.Z:
                if state == QuantumState.ZERO:
                    result = 0
                elif state == QuantumState.ONE:
                    result = 1
                else:
                    # Measuring |+> or |-> in Z basis yields random 0 or 1
                    result = secrets.randbits(1)
            else: # Basis.X
                if state == QuantumState.PLUS:
                    result = 0
                elif state == QuantumState.MINUS:
                    result = 1
                else:
                    # Measuring |0> or |1> in X basis yields random 0 or 1
                    result = secrets.randbits(1)
            self.measurements.append(result)
        return self.measurements

    def process(self, incoming_states: List[QuantumState]) -> List[int]:
        """Runs Bob's full processing pipeline"""
        if len(self.bases) != len(incoming_states):
            # Only generate bases if they weren't generated already, or lengths mismatch
            self.num_qubits = len(incoming_states)
            self.generate_random_bases()
        return self.measure_states(incoming_states)
