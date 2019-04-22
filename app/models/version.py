from orator import Model

class Version(Model):

    __fillable__ = [
        'backend_id',
        'version',
        'checksum'
    ]
