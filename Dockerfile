FROM cypress/included:8.0.0
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "test:chrome"]