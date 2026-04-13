# Aurora Field Ready - Static HTML Only
# No Node.js build required. Just serve public/ via Nginx.

FROM nginx:alpine

# Copy static assets directly
COPY public/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
