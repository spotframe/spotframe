import yaml

from flask import request
from flask_restplus import Namespace, Resource


api = Namespace('queues', description='Queues Endpoints')


queues = {}

with open('./DSL/queues.yaml') as file:
    queues = yaml.safe_load(file)



class Queues(Resource):

    def get(self, entity):
        """Get Queues"""
        return queues.get(entity)


api.add_resource(
    Queues,
    '/<string:entity>',
    methods=['GET'])
