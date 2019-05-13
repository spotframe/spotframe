import yaml
import requests

from flask import request
from flask_restplus import Namespace, Resource

import helpers.transformations as enhanced

api = Namespace('queues', description='Queues Endpoints')


queues = {}

with open('./DSL/queues.yaml') as file:
    queues = yaml.safe_load(file)



class Queues(Resource):

    def get(self, entity):
        """Get Queues"""
        response = requests.get(
            url='http://host.docker.internal:15672/api/queues',
            auth=('guest', 'guest')
        )

        if response:
            status = {
                queue.get('name'): {
                    'messages': queue.get('messages'),
                    'status': queue.get('backing_queue_status'),
                    'consumers': queue.get('consumers'),
                    'idle_since': queue.get('idle_since'),
                    'messages_ram': queue.get('messages_ram'),
                    'messages_ready': queue.get('messages_ready'),
                    'messages_ready_details': queue.get('messages_ready_details'),
                    'messages_stats': queue.get('messages_stats')
                }
                for queue in response.json()
            }

            feeded = {
                group: {
                    vname: {
                        queue: status.get(queue) for queue in physics
                    }
                    if physics
                    else None
                    for vname, physics in virtual.items()
                }
                for group, virtual in queues.get(entity).items()
            }


            listed = [
                list(virtual.values())
                for group, virtual in queues.get(entity).items()
            ]

            missing = list(
                set(status.keys())
                - set(filter(None.__ne__, enhanced.flatten(listed)))
            )

            to_merge = {
                "Ungrouped Queues": {
                    queue: { queue: status.get(queue) }
                    for queue in missing
                }
            }

            return {**feeded, **to_merge}

        else:
            return {}


api.add_resource(
    Queues,
    '/<string:entity>',
    methods=['GET'])
