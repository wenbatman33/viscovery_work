FROM python:2.7

RUN apt-get update \
    && apt-get -y install vim wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip install Flask==0.11.1
RUN pip install Flask-SQLAlchemy==2.1
RUN pip install flask_httpauth==3.2.3
RUN pip install mysql-python==1.2.5
RUN pip install gunicorn==19.6.0
RUN pip install gevent==1.2.1
CMD tail -f /dev/null

ADD . /opt/pin_stream
WORKDIR /opt/pin_stream
