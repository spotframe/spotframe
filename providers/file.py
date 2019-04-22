from .provider import Provider

from parsers.cut import dict_from_split


class File(Provider):
    def __init__(self, **kwargs):
        self.path = kwargs.get('file_path')
        self.sep = kwargs.get('separator', '|')
        self.parsers = kwargs.get('parsers')

    def run(self):

        content = None

        with open(self.path, 'r') as file:
            content = file.read()

        if self.parsers:
            return self.parser(self.parsers, content)

        return dict_from_split(content, self.sep, 1, 2)



def run(self):

    response = requests.request(
        url=self.url,
        method=self.method,
        headers=self.headers,
        json=self.body
    )

    content = response.content if self.text else response.json()

    if self.parsers:
        content = self.parser(self.parsers, content)

    return content
