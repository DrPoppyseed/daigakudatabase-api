FROM --platform=linux/x86_64 node:16-slim as base

RUN export BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
RUN export NODE_VERSION=$(node --version)

# OCI conforming image labels
# @see https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys
LABEL maintainer="DrPoppyseed"
LABEL io.daigakudatabase.image.created=${BUILD_DATE}
LABEL io.daigakudatabase.image.version="0.1.0"
LABEL io.daigakudatabase.image.node_version=${NODE_VERSION}
LABEL io.daigakudatabase.image.authors="Haruki Jay Shimada"
LABEL io.daigakudatabase.image.source="https://github.com/DrPoppyseed/daigakudatabase-api"
LABEL io.daigakudatabase.image.vendor="Haruki Jay Shimada"
LABEL io.daigakudatabase.image.title="daigakudatabase api"
LABEL io.daigakudatabase.image.description="Backend API for DaigakuDatabase's frontend client"

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ARG PORT=80
ENV PORT ${PORT}
EXPOSE ${PORT}

# set the typescript version to use tsc with
ARG TYPESCRIPT_VERSION="4.5.5"
ENV TYPESCRIPT_VERSION ${TYPESCRIPT_VERSION}

# set TINI version
ARG TINI_VERSION="v0.19.0"
ENV TINI_VERSION ${TINI_VERSION}

# installing the latest npm version for speed and fixes
RUN [ -z 'yarn --version | grep "command not found"' ] \
  && npm install --global yarn@latest \
  || npm update --global \
  ; npm cache clean --global --force

# install typescript globally to run tsc on prod
RUN yarn global add typescript@${TYPESCRIPT_VERSION} \
  && yarn cache clean --force
# installs dependencies first for easier local development
# RUN mkdir /app && chown node:node /app
RUN mkdir /app
WORKDIR /app

# add tsconfig files for any preinstall/postinstall calls that may use tsc
COPY package*.json yarn*.lock ./
RUN yarn config list \
  && yarn install --frozen-lockfile --production \
  && yarn cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# DEV STAGE
FROM base as dev
ARG NODE_ENV=development
ENV NOD_ENV ${NODE_ENV}
# installations needed for trivy.
# @look https://aquasecurity.github.io/trivy/v0.18.3/installation/
RUN apt-get update -qq \
  && apt-get install -qy \
  curl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN yarn config list \
  && yarn install --development \
  && yarn cache clean --force
ENTRYPOINT ["/tini", "--"]
CMD ["yarn", "dev"]
# USER node

# TEST STAGE
FROM dev as test
COPY . .
RUN tsc -b ./tsconfig.build.json -v
ENTRYPOINT ["/tini", "--"]
CMD ["yarn", "test"]

# scan for vulnerabilities
# USER root
COPY --from=aquasec/trivy:latest /usr/local/bin/trivy /usr/local/bin/trivy
RUN TRIVY_INSECURE=true trivy filesystem / && rm -rf /usr/local/bin/trivy

# *DO NOT RUN* PRE-PROD STAGE
# Make the image lighter by removing unnecessary files for prod
FROM test as pre-prod
RUN rm -rf ./test && rm -rf ./node_modules

# PROD STAGE
FROM base as prod
COPY --from=pre-prod /app/dist /app
HEALTHCHECK CMD curl http://127.0.0.1/ || exit 1
ENTRYPOINT ["/tini", "--"]
CMD ["node", "server.js"]
