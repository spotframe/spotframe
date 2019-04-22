from flask_restplus import Api

from .fetchers import api as fetchers_api
from .backends import api as backends_api
from .payloads import api as payloads_api


api = Api(
    title='Spotframe API',
    version='1.0',
    description='(spotframe) API',
    doc='/swagger'
)

api.add_namespace(fetchers_api)
api.add_namespace(backends_api)
api.add_namespace(payloads_api)