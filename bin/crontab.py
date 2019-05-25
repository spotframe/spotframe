#! /usr/bin/env python3
import fixpath

import os
import re
import time
import uuid
import hashlib
import threading

import yaml

import db.orm

from app.models import Backend, Version, Entry
from providers import *

db.orm.init_app()


def md5(payload):
    return hashlib.md5(payload.encode(os.getenv('ENCODING', 'utf-8'))).hexdigest()


class CronJob():
    def __init__(self, name, params):
        self.name = name
        self.params = params
        self.time = self.schedule_in_seconds(params.get('schedule'))
        threading.Thread(target=self.run).start()

    def schedule_in_seconds(self, schedule):
        amount, scale = schedule.split()

        scales = ('second', 'minute', 'hour')
        values = { scale: 60**i for i, scale in enumerate(scales) }

        return int(amount) * values.get(re.search(r'\w+[^s]', scale).group())


    def run(self):
        verbose = '[ backend:{backend} -> each: {schedule} ]'.format(
            backend=self.name, schedule=self.params.get('schedule'))

        while True:

            tracing = str(uuid.uuid4()).split('-')[-1]

            try:
                print(f'({tracing}) {verbose} - Performing background Job...')

                provider = self.params.get('provider')
                response = globals()[provider.capitalize()](**self.params).run()

                checksum = md5(str(response))

                print(f'({tracing}) {verbose} - {len(response)} entries fetched from backend')
                print(f'({tracing}) {verbose} - Computing checksum against the previous one...')

                backend = Backend.first_or_new(backend=self.name)

                if not backend.exists:
                    backend.last_version = 0
                    backend.save()

                version = Version.first_or_new(
                    backend_id=backend.id,
                    version=backend.last_version,
                    checksum=checksum
                )

                if version.exists:
                    print(f'({tracing}) {verbose} - No new content! skiping this version')

                else:
                    new_version = backend.last_version + 1
                    version.version = new_version
                    version.save()

                    if response and isinstance(response, dict):

                        print(f'({tracing}) {verbose} - New content! Creating version {self.name}->{new_version}')

                        backend.update(last_version=new_version)

                        for key, value in response.items():
                            Entry.create(
                                backend_id=backend.id,
                                version_id=version.id,
                                version=new_version,
                                key=key,
                                value=value
                            )

                    else:
                        print(f'({tracing}) {verbose} - ERROR MALFORMED PAYLOAD: {response}')

            except Exception as e:
                print(f'({tracing}) {verbose} - Exception: {e}')

            time.sleep(self.time)


try:

    with open('./DSL/integrations.yaml') as file:
        backends = yaml.safe_load(file).get('backends')

        for backend, params in backends.items():
            CronJob(backend, params)


except (KeyboardInterrupt, SystemExit):
    print('Exiting...')
