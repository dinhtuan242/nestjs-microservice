# Stage 1: Development
FROM node:alpine As development

WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app's source code
COPY . .

# Build the app
RUN yarn build

# Stage 2: Production
FROM node:alpine as production

# Set environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --prod

# Copy the build artifacts from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/reservations/main"]
