# Nginx Reverse Proxy Dockerfile
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy configuration template
COPY nginx-ssl.conf /etc/nginx/templates/default.conf.template

# Create entrypoint script for SSL certificate handling
COPY docker-entrypoint.sh /docker-entrypoint.d/90-ssl-setup.sh
RUN chmod +x /docker-entrypoint.d/90-ssl-setup.sh

# Create non-root user for security
RUN addgroup -g 101 -S nginx && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 80 443