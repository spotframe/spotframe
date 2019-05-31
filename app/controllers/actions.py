import json
import yaml

from flask import request
from flask_restplus import Namespace, Resource

import helpers.transformations as enhanced

from providers import *
from app.models import Payload


api = Namespace('actions', description='Actions Endpoints')

actions = {}

with open('./DSL/integrations.yaml') as file:
    actions = yaml.safe_load(file).get('actions')



class Actions(Resource):

    def post(self, action, uuid):
        """Post Actions"""

        payload = Payload.where('uuid', uuid).first()

        if payload:
            content = json.loads(payload.payload)

            params = enhanced.map(
                actions.get(action),
                lambda t: enhanced.translate(
                    t,
                    payload=content.get('payload', {}),
                    changes=request.get_json()
                )
            )

            provider = params.get('provider')
            response = globals()[provider.capitalize()](**params).run()

            return response


        return {}


api.add_resource(
    Actions,
    '/<string:action>/<string:uuid>',
    methods=['POST'])
