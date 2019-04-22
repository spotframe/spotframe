import re


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


def translate(text, payload):
    return re.sub(
        r'{([^}]+)}',
        lambda m: str(
            get(payload, m.group(1))
        ),
        text
    )


def map(data, fn):
    result = {}
    for k, v in data.items():
        if isinstance(v, dict):
            v = map(v, fn)
        result[k] = v if isinstance(v, dict) else fn(v)
    return result
