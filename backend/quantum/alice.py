import secrets
from typing import List
from .constants import Basis, QuantumState

class Alice:
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.bits: List[int] = []
        self.bases: List[Basis] = []
        self.states: List[QuantumState] = []

    def generate_random_bits(self) -> List[int]:
        # Using pseudo-random numbers suitable for simulation (secrets module is crypto-safe)
        self.bits = [secrets.randbits(1) for _ in range(self.num_qubits)]
        return self.bits

    def generate_random_bases(self) -> List[Basis]:
        self.bases = [Basis.Z if secrets.randbelow(2) == 0 else Basis.X for _ in range(self.num_qubits)]
        return self.bases

    def encode_states(self) -> List[QuantumState]:
        self.states = []
        for bit, basis in zip(self.bits, self.bases):
            if basis == Basis.Z:
                state = QuantumState.ZERO if bit == 0 else QuantumState.ONE
            else:
                state = QuantumState.PLUS if bit == 0 else QuantumState.MINUS
            self.states.append(state)
        return self.states

    def prepare(self) -> List[QuantumState]:
        """Runs the whole preparation pipeline and returns states"""
        self.generate_random_bits()
        self.generate_random_bases()
        return self.encode_states()
