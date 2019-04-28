from flask import request
from flask_restplus import Namespace, Resource

from app.models import Backend


api = Namespace('backends', description='Backends Endpoints')

def get_backends(backend=None):
    if backend:
        backends = Backend.where('backend', backend).first()

        return {
            backend.get('key'): backend.get('value')
            for backend in backends.entries().serialize()
        } if backends else {}

    else:
        return Backend.all().serialize()


class Backends(Resource):

    def get(self, backend=None):
        """Get Backends"""
        return get_backends(backend)



api.add_resource(
    Backends,
    '/',
    methods=['GET'])

api.add_resource(
    Backends,
    '/<string:backend>',
    methods=['GET'])
