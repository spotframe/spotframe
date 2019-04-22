FROM        alpine:3.9
MAINTAINER  Spotframe

ARG         DIR=/app

WORKDIR     $DIR
ADD .       $DIR

RUN         apk add -U ca-certificates linux-headers make automake autoconf libtool
RUN         apk add -U gcc g++ python3 python3-dev postgresql-dev

RUN         pip3 install -r requirements.txt

ENTRYPOINT  ["/usr/bin/make"]
CMD         ["test"]
