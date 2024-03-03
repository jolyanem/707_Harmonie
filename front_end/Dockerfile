FROM nginx:alpine

COPY ./dist /var/www/app/dist
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]