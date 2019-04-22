from abc import ABC, abstractmethod

class Parser(ABC):
    def __init__(self, payload, expression):
        self.payload = payload
        self.expression = expression
