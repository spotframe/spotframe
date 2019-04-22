import os

DATABASES = {
    'default': {
        'driver':    'postgres',
        'host':      os.getenv('DB_HOST'),
        'port':      os.getenv('DB_PORT'),
        'database':  os.getenv('DB_NAME'),
        'user':      os.getenv('DB_USER'),
        'password':  os.getenv('DB_PASS')
    }
}