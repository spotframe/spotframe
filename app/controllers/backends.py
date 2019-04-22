from flask import request
from flask_restplus import Namespace, Resource

from app.models import Backend
from app.models import Version
from app.models import Entry


api = Namespace('backends', description='Backends Endpoints')


class Backends(Resource):

    def get(self, backend=None):
        """Get Backends"""
        if backend:
            return (
                Backend.where('backend', backend)
                .first()
                .entries()
                .serialize()
            )
        else:
            return Backend.all().serialize()



api.add_resource(
    Backends,
    '/',
    methods=['GET'])

api.add_resource(
    Backends,
    '/<string:backend>',
    methods=['GET'])
