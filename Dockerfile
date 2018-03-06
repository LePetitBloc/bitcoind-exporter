FROM node:alpine

ENV NODE_ENV development
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV npm_package_config_port 3000

COPY . /app/

WORKDIR /app/

RUN npm i

EXPOSE ${npm_package_config_port}

CMD ["npm", "start"]
