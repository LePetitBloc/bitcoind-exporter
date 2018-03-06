FROM node:alpine

ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=error \
    NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV label=wallet \
    symbol=DASH \
    rpcuser=rpcuser \
    rpcpassword=rpcpassword \
    rpchost=127.0.0.1 \
    rpcport=9998 \
    rpcscheme=http

COPY . /app/

WORKDIR /app/

RUN npm i

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["index.js"]
