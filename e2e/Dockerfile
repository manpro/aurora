FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /e2e

# Copy config and tests
COPY package.json .
COPY playwright.config.ts .
COPY tests/ ./tests/

# Install dependencies
RUN npm install
RUN npx playwright install --with-deps chromium

# Default command: run all tests
CMD ["npx", "playwright", "test"]
