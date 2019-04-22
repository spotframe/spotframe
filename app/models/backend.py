from orator import Model

from .entry import Entry

class Backend(Model):

    __fillable__ = [
        'backend',
        'last_version'
    ]

    def entries(self):
        return (
            Entry
                .where('backend_id', self.id)
                .where('version', self.last_version)
                .select('key', 'value')
                .get()
        )
