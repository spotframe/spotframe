import json
import uuid

from flask import request
from flask_restplus import Namespace, Resource, fields

from app.models import Payload


api = Namespace('payloads', description='Payloads Endpoints')

def get_payload_by_uuid(uuid):
    payload = Payload.where('uuid', uuid).first()
    return payload.serialize() if payload else {}


class Payloads(Resource):

    def get(self, uuid):
        """Get a Payload"""
        return get_payload_by_uuid(uuid)

    @api.doc(params={
        'body': {
            'in': 'body',
            'required': True,
            'description': '{"entity": "Entity Type", "payload": "{""}"}'
        }
    })

    def post(self):
        """Create a Payload"""
        return Payload.create(
            uuid=str(uuid.uuid4()),
            payload=json.dumps(request.get_json())
        ).serialize()



api.add_resource(
    Payloads,
    '/<string:uuid>',
    methods=['GET'])

api.add_resource(
    Payloads,
    '/',
    methods=['POST'])
