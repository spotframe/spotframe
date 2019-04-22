from orator import Model

class Entry(Model):
    
    __fillable__ = [
        'version_id',
        'backend_id',
        'version',
        'key',
        'value'
    ]