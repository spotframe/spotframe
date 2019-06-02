import yaml

from flask import request
from flask_restplus import Namespace, Resource

from db import dsl


api = Namespace('entities', description='Entities Endpoints')


class Entities(Resource):

    def get(self, entity=None):
        """Get Entities"""
        return (
            dsl.file.entities.get(entity)
            if entity else dsl.file.entities
        )


api.add_resource(
    Entities,
    '/',
    methods=['GET'])

api.add_resource(
    Entities,
    '/<string:entity>',
    methods=['GET'])
