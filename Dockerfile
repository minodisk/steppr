FROM node:9

WORKDIR /steppr

RUN mkdir src lib
COPY package.json yarn.lock ./
RUN yarn

COPY .babelrc ./
COPY .git .git
COPY src src
COPY __tests__ __tests__

CMD yarn build

