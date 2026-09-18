from enum import Enum

class Basis(Enum):
    Z = "Z"  # Computational Basis
    X = "X"  # Hadamard/Diagonal Basis

class QuantumState(Enum):
    ZERO = "0"    # |0⟩
    ONE = "1"     # |1⟩
    PLUS = "+"    # |+⟩
    MINUS = "-"   # |-⟩
