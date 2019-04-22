import re

from .parser import Parser


def dict_from_split(payload, delimiter, k, v):

    lines = [
        dict(enumerate(line.split(delimiter)))
        for line in payload.splitlines()
    ]

    return {
        line.get(int(k)-1, str()): line.get(int(v)-1, str())
        for line in lines
    }


class Cut(Parser):

    def parser(self):
        
        sep, key, value = re.search(
            r'-d\s*([^\s]+)\s*-f\s*(\d+)\s*,\s*(\d+)$',
            self.expression
        ).groups()

        return dict_from_split(self.payload, sep, key, value)
