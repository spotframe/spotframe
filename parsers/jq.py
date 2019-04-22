from jq import jq

from .parser import Parser


class Jq(Parser):

    def parser(self):
        return jq(self.expression).transform(self.payload)
