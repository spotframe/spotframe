import re
import json
from operator import xor
from ast import literal_eval

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


def translate(struct, except_pattern=None, **kwargs):
    if xor(not isinstance(struct, str),
        bool(except_pattern and re.match(except_pattern, struct))):
        return struct

    evaluated = None
    translated = jinja2.Template(struct).render(**kwargs)

    try:
        evaluated = literal_eval(translated)
        return json.dumps(evaluated) if type(evaluated) in {dict, list} else evaluated
    except Exception:
        return translated



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
