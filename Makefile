.PHONY: test

PYTHON3=/usr/bin/env python3


test:
	@${PYTHON3} -m unittest discover

cron:
	@${PYTHON3} -u bin/crontab.py

api:
	@${PYTHON3} -u bin/api.py

migrate:
	@orator migrate --force -c config/databases.py -p db/migrations/