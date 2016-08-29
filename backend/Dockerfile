FROM python:3.5.2
MAINTAINER Vlad Lopalo

ENV LANG C.UTF-8
COPY . /drill/backend
WORKDIR /drill/backend

RUN apt-get update -y
RUN apt-get install enchant -y
RUN apt-get install myspell-ru -y

RUN python3.5 -m pip install -r requirements.txt
