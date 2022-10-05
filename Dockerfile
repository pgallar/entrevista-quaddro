FROM node

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

EXPOSE 3000 9229
CMD bash -c "npm run dev"