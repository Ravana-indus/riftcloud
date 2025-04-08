# Deploying to Cloudflare Pages

This document outlines the steps to deploy this application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- GitHub repository connected to Cloudflare Pages
- API tokens and secrets set up in GitHub

## Manual Deployment

1. Build the application:
   ```
   npm run build
   ```

2. The build output will be in the `dist` directory, with all necessary files for Cloudflare Pages.

3. In the Cloudflare Pages dashboard, create a new project or select your existing one.

4. If deploying manually, upload the contents of the `dist` directory.

## Automated Deployment via GitHub Actions

This project includes a GitHub Actions workflow for continuous deployment to Cloudflare Pages:

1. Set up the following secrets in your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. Push to the `main` branch, and GitHub Actions will automatically build and deploy to Cloudflare Pages.

## Configuration

The following configuration files are included for Cloudflare Pages:

- `_redirects`: Handles SPA routing
- `_headers`: Sets proper MIME types and security headers
- `wrangler.toml`: Cloudflare Workers/Pages configuration

## Testing Locally

To test the production build locally in a way that mimics Cloudflare Pages:

```
npm run build
npm run preview:cf
```

Then open your browser to http://localhost:3000

## Troubleshooting

### MIME Type Issues

If you encounter MIME type errors:
- Check that the `_headers` file is correctly copied to the `dist` directory
- Verify that the build script is correctly configured to include the headers file
- Try using the local preview to test MIME type handling

### Routing Issues

If routes are not working:
- Ensure the `_redirects` file is correctly copied to the `dist` directory
- Check that the SPA routing rule `/* /index.html 200` is properly configured 