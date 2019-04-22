from abc import ABC, abstractmethod

from parsers import *


class Provider(ABC):
    def parser(self, parsers, payload):
        aggregator = payload

        for parser in parsers:
            [unpack] = list(parser.items())
            name, expression = unpack

            aggregator = globals()[name.capitalize()](
                aggregator, expression
            ).parser()

        return aggregator
