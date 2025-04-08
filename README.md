# CloudFlare Pages Deployment

This is a copy of the Ravana IoF application configured specifically for CloudFlare Pages deployment.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.production` to `.env` if needed
   - Update any environment-specific variables

3. Test the build locally:
```bash
npm run build
npm run preview:cf
```

## Deployment to CloudFlare Pages

### Option 1: Manual Deployment

1. Build the application:
```bash
npm run build
```

2. The build output will be in the `dist` directory.

3. In the CloudFlare Pages dashboard:
   - Create a new project or select your existing one
   - Upload the contents of the `dist` directory

### Option 2: Git-based Deployment

1. Push this directory to a Git repository.

2. In CloudFlare Pages dashboard:
   - Connect to your Git repository
   - Configure build settings:
     - Framework preset: None
     - Build command: `npm run build:cloudflare`
     - Build output directory: `dist`
     - Environment variables: Set any required environment variables

3. Set up the environment variables in CloudFlare Pages:
   - PAYHERE_MERCHANT_ID
   - PAYHERE_MERCHANT_SECRET
   - API_BASE_URL
   - API_TOKEN
   - Other required variables

## Troubleshooting

If you encounter issues during deployment:

1. Check that all CloudFlare-specific files are present:
   - `_redirects` - Handles SPA routing
   - `_headers` - Sets MIME types and security headers
   - `_routes.json` - API route configuration
   - `.cloudflare-cache-control` - Cache control settings

2. Verify build settings:
   - Make sure build command is correct
   - Ensure output directory is set to `dist`

3. Check CloudFlare Pages logs for any build errors

## Notes

- Make sure API routes are properly configured in `functions/` directory
- Remember to update environment variables for production
- The build script automatically copies CloudFlare configuration files to the dist directory # riftcloud
