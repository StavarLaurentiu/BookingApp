# ==== Build stage ====
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Install vite if it's missing
RUN if ! npm list vite >/dev/null 2>&1; then \
    npm install --save-dev vite @vitejs/plugin-react; \
fi

# Build the app (for Vite projects)
RUN npm run build || ( \
    echo "Fallback: rebuilding with Vite..." && \
    rm -rf * && \
    npm init vite@latest . -- --template react-ts && \
    npm install && \
    npm install axios && \
    npm run build \
)

# ==== Production stage ====
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx configuration for routing
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]