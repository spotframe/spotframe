import fixpath

import os
import yaml

from flask import Flask
from flask_cors import CORS

from db import orm, broker
from app.controllers import api

app = Flask(__name__)
CORS(app)

api.init_app(app)
orm.init_app(app)


with open('./DSL/entities.yaml') as file:

    _broker = broker.Broker(
        host=os.getenv('BROKER_HOST'),
        port=os.getenv('BROKER_PORT'),
        username=os.getenv('BROKER_USER'),
        password=os.getenv('BROKER_PASS')
    )

    for entity in list(yaml.safe_load(file).keys()):
        _broker.create_vhost(entity)


if __name__ == '__main__':
    app.run(
        debug=os.getenv('API_DEBUG', False),
        host=os.getenv('API_BIND', '0.0.0.0'),
        port=os.getenv('API_PORT', 5000))
