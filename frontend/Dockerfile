FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run build


FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]