FROM node:6.2.2

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json npm-shrinkwrap.json $HOME/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/
RUN npm install

USER root
COPY . $HOME/
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "index.js"]
