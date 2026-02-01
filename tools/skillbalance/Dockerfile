FROM node:20-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false && npm install

COPY . .

EXPOSE 5173 5178

CMD ["npm", "run", "dev:all"]
