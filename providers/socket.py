from .provider import Provider

import socket


class Socket(Provider):
    def __init__(self, **kwargs):
        self.host = kwargs.get('host')
        self.port = kwargs.get('port')
        self.cmd = kwargs.get('command')
        self.encoding = kwargs.get('server_encoding', 'utf-8')

    def run(self):
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.connect((self.host, self.port))
        client.sendall(self.cmd.encode(self.encoding))

        buffer = b""

        while True:
            data = client.recv(4096)
            if not data:
                break
            buffer += data

        return buffer.decode(self.encoding)
