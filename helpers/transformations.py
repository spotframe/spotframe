import re
import jinja2


def get(payload, path=str()):
    try:
        if not bool(len(path)):
            return payload

        keys = path.split('.')

        if keys: 
            return get(
                payload.get(keys[0]),
                '.'.join(keys[1:])
            )

    except AttributeError:
        return None


def translate(text, except_pattern=str(), **kwargs):
    return (
        jinja2.Template(text).render(**kwargs)
        if isinstance(text, str)
        and not re.match(except_pattern, text)
        else text
    )


def map(data, fn):
    _types = (dict, list, bool)

    def _map(_values):
        return [
            map(e, fn) if type(e) in _types else fn(e)
            for e in _values
        ]

    if isinstance(data, list):
        return _map(data)

    result = {}

    for k, v in data.items():
        if isinstance(v, dict):
            v = map(v, fn)
        if isinstance(v, list):
            v = _map(v)
        result[k] = v if type(v) in _types else fn(v)

    return result


def flatten(data):
    for e in data:
        if isinstance(e, list):
            yield from flatten(e)
        else:
            yield e
