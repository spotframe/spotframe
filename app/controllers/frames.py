import re
import json
import yaml

from flask import request
from flask_restplus import Namespace, Resource

import helpers.transformations as enhanced

from .backends import get_backends
from .payloads import get_payload_by_uuid


api = Namespace('frames', description='Frames Endpoints')


screens = {}

with open('./DSL/screens.yaml') as file:
    screens = yaml.safe_load(file)



class Frames(Resource):

    def get(self, uuid):
        """Get Frames"""
        payload = get_payload_by_uuid(uuid)

        if payload:

            content = json.loads(payload.get('payload'))

            backends = re.findall(
                r"[Bb]ackend': '([^']+)'",
                str(screens.get(content.get('entity')))
            )

            return {
                'backends': {
                    b: get_backends(b) for b in backends
                }
                ,
                'frames': {
                    screen: enhanced.map(
                        components,
                        lambda t: enhanced.translate(
                            t, content.get('payload')
                        )
                    )
                    for screen, components in screens.get(
                        content.get('entity')
                    ).items()
                }
            }

        return dict()



api.add_resource(
    Frames,
    '/<string:uuid>',
    methods=['GET'])