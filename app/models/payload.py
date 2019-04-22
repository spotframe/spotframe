from orator import Model

class Payload(Model):

    __fillable__ = [
        'uuid',
        'payload'
    ]
