FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# We assume frontend is built and copied to src/public before this build
# Or we can do a multi-stage build. Since I already copied the dist to src/public, 
# this image will contain the frontend.

EXPOSE 3000

CMD ["node", "src/server.js"]
