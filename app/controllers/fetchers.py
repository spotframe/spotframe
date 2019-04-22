import json
import yaml

from flask import request
from flask_restplus import Namespace, Resource

import helpers.transformations as enhanced

from providers import *
from app.models import Payload


api = Namespace('fetchers', description='Fetchers Endpoints')

fetchers = {}

with open('./DSL/integrations.yaml') as file:
    fetchers = yaml.safe_load(file).get('fetchers')



class Fetchers(Resource):

    def get(self, fetch, uuid):
        """Get Fetchers"""

        payload = Payload.where('uuid', uuid).first()

        if payload:
            content = json.loads(payload.payload)

            params = enhanced.map(
                fetchers.get(fetch),
                lambda t: enhanced.translate(t, content)
            )

            provider = params.get('provider')
            response = globals()[provider.capitalize()](**params).run()

            return response


        return {}


api.add_resource(
    Fetchers,
    '/<string:fetch>/<string:uuid>',
    methods=['GET'])
