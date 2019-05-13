import pika


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

    def publish(self, routing_key, body, properties={}, exchange=str()):
        return self.channel().basic_publish(
            exchange=exchange,
            routing_key=routing_key,
            properties=pika.BasicProperties(
                headers=properties
            ),
            body=body
        )

    def channel(self):

        if self.conn:
            try:
                self.conn.process_data_events()
            except Exception as e:
                self.conn = None
                traceback.print_exc()

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
