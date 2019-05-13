import yaml

from flask import request
from flask_restplus import Namespace, Resource


api = Namespace('entities', description='Entities Endpoints')


entities = {}

with open('./DSL/entities.yaml') as file:
    entities = yaml.safe_load(file)



class Entities(Resource):

    def get(self, entity=None):
        """Get Entities"""
        return entities.get(entity) if entity else entities


api.add_resource(
    Entities,
    '/',
    methods=['GET'])

api.add_resource(
    Entities,
    '/<string:entity>',
    methods=['GET'])
