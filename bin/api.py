import fixpath

import os
from flask import Flask
from flask_cors import CORS

from db import orm
from app.controllers import api

app = Flask(__name__)
CORS(app)

api.init_app(app)
orm.init_app(app)


if __name__ == '__main__':
    app.run(
        debug=os.getenv('API_DEBUG', False),
        host=os.getenv('API_BIND', '0.0.0.0'),
        port=os.getenv('API_PORT', 5000))
