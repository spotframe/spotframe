from .provider import Provider

import os


class Shell(Provider):
    def __init__(self, **kwargs):
        self.cmd = kwargs.get('command')

    def run(self):
        return os.popen(
            """/bin/bash -c \"{cmd}\"""".format(
                cmd=self.cmd
            )
        ).read()
