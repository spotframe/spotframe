import json
import yaml

from flask import request
from flask_restplus import Namespace, Resource

from db import dsl

import helpers.transformations as enhanced

from .backends import get_backends
from .payloads import get_payload_by_uuid


api = Namespace('frames', description='Frames Endpoints')


class Frames(Resource):

    def get(self, uuid):
        """Get Frames"""
        payload = get_payload_by_uuid(uuid)

        if payload:

            content = json.loads(payload.get('payload'))

            return {
                'frames': {
                    screen: enhanced.map(
                        components,
                        lambda t: enhanced.translate(
                            t, payload=content.get('payload')
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
