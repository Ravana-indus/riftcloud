#!/bin/bash

# Create necessary directories
mkdir -p CloudFlare/src
mkdir -p CloudFlare/public
mkdir -p CloudFlare/functions

# Copy source code
cp -r ravanaiof/src/* CloudFlare/src/
cp -r ravanaiof/public/* CloudFlare/public/
cp -r ravanaiof/functions/* CloudFlare/functions/

# Copy configuration files
cp ravanaiof/package.json CloudFlare/
cp ravanaiof/vite.config.ts CloudFlare/
cp ravanaiof/tsconfig.json CloudFlare/
cp ravanaiof/tsconfig.app.json CloudFlare/
cp ravanaiof/tsconfig.node.json CloudFlare/
cp ravanaiof/tailwind.config.ts CloudFlare/
cp ravanaiof/postcss.config.js CloudFlare/
cp ravanaiof/index.html CloudFlare/
cp ravanaiof/components.json CloudFlare/
cp ravanaiof/eslint.config.js CloudFlare/
cp ravanaiof/.npmrc CloudFlare/

# Copy CloudFlare-specific files
cp ravanaiof/_redirects CloudFlare/
cp ravanaiof/_headers CloudFlare/
cp ravanaiof/_routes.json CloudFlare/
cp ravanaiof/.cloudflare-cache-control CloudFlare/
cp ravanaiof/wrangler.toml CloudFlare/
cp ravanaiof/.pages.yml CloudFlare/
cp ravanaiof/CLOUDFLARE_PAGES.md CloudFlare/
cp ravanaiof/preview.js CloudFlare/

# Copy environment files (make sure to update these for production)
cp ravanaiof/.env.development CloudFlare/
cp ravanaiof/.env.local CloudFlare/.env.production

# Create a new .gitignore file
cat > CloudFlare/.gitignore << EOF
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Build outputs
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.production.local
.env.development.local
.env.test.local
EOF

echo "Files copied successfully to CloudFlare directory" 