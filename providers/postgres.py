from .provider import Provider

import re
import datetime
import psycopg2


class Postgres(Provider):
    def __init__(self, **kwargs):
        self.host = kwargs.get('host')
        self.port = int(kwargs.get('port', 5432))
        self.username = kwargs.get('username', 'postgres')
        self.password = kwargs.get('password')
        self.database = kwargs.get('database', 'postgres')
        self.query = kwargs.get('query')
        self.parsers = kwargs.get('parsers', None)

    def run(self):

        records = None

        try:
            connection = psycopg2.connect(
                user=self.username,
                password=self.password,
                host=self.host,
                port=self.port,
                dbname=self.database,
                cursor_factory=psycopg2.extras.RealDictCursor
            )

            cursor = connection.cursor()
            cursor.execute(self.query)

            if re.match(r'^SELECT', self.query):
                records = [
                    {
                        k: str(v) if isinstance(v, datetime.datetime) else v
                        for k, v in dict(record).items()
                    }
                    for record in cursor.fetchall()
                ]
            else:
                connection.commit()
                records = {'affected_rows': cursor.rowcount}

        except (Exception, psycopg2.Error) as error:
            return records

        finally:
            if (connection):
                cursor.close()
                connection.close()

        if self.parsers:
            records = self.parser(self.parsers, records)

        return records
