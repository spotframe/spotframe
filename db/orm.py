import yaml

from config.databases import DATABASES


def init_app(app=None):

    if app:
        from flask_orator import Orator

        app.config['ORATOR_DATABASES'] = DATABASES
        Orator(app)

    else:
        from orator import DatabaseManager, Model

        db = DatabaseManager(DATABASES)
        Model.set_connection_resolver(db)
