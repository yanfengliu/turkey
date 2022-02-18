FROM cypress/included:8.7.0
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "test:chrome"]
