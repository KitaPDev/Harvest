FROM node:alpine
LABEL maintainer="Modern Farms <themodernfarms@gmail.com>"
WORKDIR /usr/src/app
COPY ./yarn.lock ./
RUN yarn
COPY . .
CMD ["yarn", "start"]

# FROM nginx:alpine
# COPY --from=frontend-build /app/dist/frontend-angular /usr/share/nginx/html
# EXPOSE 80
