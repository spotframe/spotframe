from .provider import Provider

import jq
import requests


class Http(Provider):
    def __init__(self, **kwargs):
        self.kwargs = kwargs
        self.url = kwargs.get('url', 'localhost')
        self.method = kwargs.get('method', 'GET')
        self.headers = kwargs.get('headers', {})
        self.text = bool(kwargs.get('force_text', False))
        self.parsers = kwargs.get('parsers', None)

    def run(self):
        kwargs = {
            k: v for k, v in self.kwargs.items()
            if k in ('json')
        }

        response = requests.request(
            url=self.url,
            method=self.method,
            headers=self.headers,
            **kwargs
        )

        content = response.content if self.text else response.json()

        if self.parsers:
            content = self.parser(self.parsers, content)

        return content
