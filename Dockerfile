FROM ubuntu:14.04
MAINTAINER Vlad Lopalo

ENV LANG C.UTF-8
COPY . /drill
WORKDIR /drill

RUN apt-get update
RUN apt-get install software-properties-common -y
RUN add-apt-repository ppa:fkrull/deadsnakes
RUN apt-get update
RUN apt-get install build-essential curl -y
RUN apt-get install python3.5 python3.5-dev -y

RUN curl https://bootstrap.pypa.io/get-pip.py | python3.5
RUN python3.5 -m pip install -r backend/requirements.txt
