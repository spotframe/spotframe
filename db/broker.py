import os
import pika
import requests
import traceback


class Broker:
    def __init__(
        self,
        host,
        port=5672,
        vhost='/',
        username='guest',
        password='guest',
    ):
        self.conn = None
        self.chan = None
        self.host = host
        self.port = int(port)
        self.vhost = vhost
        self.user = username
        self.passwd = password

    def publish(
        self,
        routing_key,
        body,
        properties={},
        exchange=str(),
    ):
        return self.channel().basic_publish(
            exchange=exchange,
            routing_key=routing_key,
            properties=pika.BasicProperties(
                delivery_mode=2, headers=properties
            ),
            body=body,
        )

    def channel(self):

        if self.conn:
            try:
                self.conn.process_data_events()
            except Exception:
                self.conn = None
                pass

        if not self.conn or not self.conn.is_open:
            self.conn = pika.BlockingConnection(
                pika.ConnectionParameters(
                    self.host,
                    self.port,
                    self.vhost,
                    pika.PlainCredentials(
                        self.user, self.passwd
                    ),
                )
            )
            self.chan = self.conn.channel()
            self.chan.confirm_delivery()

        if not self.chan or not self.chan.is_open:
            self.chan = self.conn.channel()
            self.chan.confirm_delivery()

        return self.chan

    def get_queues(self, vhost):
        response = requests.get(
            url=f'http://{self.host}:1{self.port}/api/queues/{vhost}',
            auth=(self.user, self.passwd),
        )

        return response.json()

    def create_vhost(self, vhost):
        url = f'http://{self.host}:1{self.port}/api/vhosts/{vhost}'

        try:

            response = requests.put(
                url, auth=(self.user, self.passwd)
            )

            response.raise_for_status()

        except Exception as e:
            print('NEW_VHOST', e)

        try:

            url = f'http://{self.host}:1{self.port}/api/permissions/{vhost}/{self.user}'

            response = requests.put(
                url,
                json={
                    'configure': '.*',
                    'write': '.*',
                    'read': '.*',
                },
                auth=(self.user, self.passwd),
            )

            response.raise_for_status()

        except Exception as e:
            print('NEW_PERMISSIONS', e)
