import os

import json
import uuid

from flask import request
from flask_restplus import Namespace, Resource, fields

from app.models import Payload
from db.broker import Broker

api = Namespace('payloads', description='Payloads Endpoints')

broker = Broker(host=os.getenv('BROKER_HOST'))

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
            'description': 'Create a Payload',
            'example': {
                'entity': 'Entity Type',
                'queue': '',
                'payload': {}
            }

        }
    })

    def post(self):
        """Create a Payload"""
        payload = Payload.create(
            uuid=str(uuid.uuid4()),
            payload=json.dumps(request.get_json())
        )

        if payload:

            queue = request.get_json().get('queue') or 'incoming'
            message = {'uuid': payload.uuid}

            broker.channel().queue_declare(
                queue=queue,
                durable=True
            )

            message_sent = broker.publish(
                routing_key=queue,
                body=json.dumps(message),
                properties=message
            )

            return message

        return {}



api.add_resource(
    Payloads,
    '/<string:uuid>',
    methods=['GET'])

api.add_resource(
    Payloads,
    '/',
    methods=['POST'])
