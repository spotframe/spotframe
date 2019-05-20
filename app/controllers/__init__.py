from flask_restplus import Api

from .entities import api as entities_api
from .fetchers import api as fetchers_api
from .backends import api as backends_api
from .payloads import api as payloads_api
from .actions import api as actions_api
from .frames import api as frames_api
from .queues import api as queues_api


api = Api(
    title='Spotframe API',
    version='1.0',
    description='(spotframe) API',
    doc='/swagger'
)

api.add_namespace(entities_api)
api.add_namespace(fetchers_api)
api.add_namespace(backends_api)
api.add_namespace(payloads_api)
api.add_namespace(actions_api)
api.add_namespace(frames_api)
api.add_namespace(queues_api)
