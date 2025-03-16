# Cloudflare Integration and R2 Setup

This document provides detailed information about the Cloudflare integration and R2 setup for the Socialize project.

## Overview

Socialize uses Cloudflare for DNS management, SSL, security, and content delivery. Additionally, Cloudflare R2 is used for storing user-generated content such as images, videos, and other media files.

## Cloudflare Setup

### Prerequisites

- Cloudflare account
- Domain registered and added to Cloudflare
- API token with appropriate permissions

### DNS Configuration

1. Log in to your Cloudflare account
2. Select your domain
3. Go to the DNS tab
4. Add the following records:
   - A record: `@` pointing to your server IP
   - CNAME record: `www` pointing to `@`
   - CNAME record: `api` pointing to `@`

### SSL/TLS Configuration

1. Go to the SSL/TLS tab
2. Set the encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

### Firewall Rules

1. Go to the Firewall tab
2. Create rules to protect your application:
   - Block suspicious IPs
   - Rate limiting for API endpoints
   - Challenge suspicious requests

### Page Rules

1. Go to the Page Rules tab
2. Create rules for caching:
   - Cache static assets: `*example.com/assets/*`
   - Bypass cache for API: `*example.com/api/*`

## Cloudflare R2 Setup

### Creating an R2 Bucket

1. Log in to your Cloudflare account
2. Go to R2 in the sidebar
3. Click "Create bucket"
4. Name your bucket (e.g., `socialize-media`)
5. Choose a region close to your users

### API Tokens

1. Go to "Account Home" > "R2" > "Manage R2 API Tokens"
2. Create a new API token with read and write permissions
3. Save the Access Key and Secret Key securely

### Environment Variables

Add the following environment variables to your `.env` file:

```
CLOUDFLARE_R2_ACCESS_KEY=your_access_key
CLOUDFLARE_R2_SECRET_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
```

## Integration with Laravel

### Installation

Add the AWS SDK to your Laravel project:

```bash
composer require aws/aws-sdk-php
```

### Configuration

Create a new file `config/filesystems.php` or update the existing one to include R2:

```php
's3' => [
    'driver' => 's3',
    'key' => env('CLOUDFLARE_R2_ACCESS_KEY'),
    'secret' => env('CLOUDFLARE_R2_SECRET_KEY'),
    'region' => 'auto',
    'bucket' => env('CLOUDFLARE_R2_BUCKET'),
    'url' => env('CLOUDFLARE_R2_URL'),
    'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
    'use_path_style_endpoint' => true,
],
```

### Usage Example

```php
use Illuminate\Support\Facades\Storage;

// Upload a file
Storage::disk('s3')->put('avatars/1.jpg', $fileContents);

// Get a file
$file = Storage::disk('s3')->get('avatars/1.jpg');

// Generate a temporary URL
$url = Storage::disk('s3')->temporaryUrl(
    'avatars/1.jpg', now()->addMinutes(5)
);

// Delete a file
Storage::disk('s3')->delete('avatars/1.jpg');
```

## Integration with React Frontend

### Installation

Add the AWS SDK to your React project:

```bash
npm install aws-sdk
```

### Configuration

Create a utility file for R2 operations:

```javascript
// src/utils/r2.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_CLOUDFLARE_R2_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_CLOUDFLARE_R2_SECRET_KEY,
  endpoint: process.env.REACT_APP_CLOUDFLARE_R2_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

export const uploadFile = async (file, path) => {
  const params = {
    Bucket: process.env.REACT_APP_CLOUDFLARE_R2_BUCKET,
    Key: path,
    Body: file,
    ContentType: file.type,
  };

  try {
    const response = await s3.upload(params).promise();
    return response.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
```

### Security Considerations

- Never expose R2 credentials in client-side code
- Use pre-signed URLs for direct uploads from the frontend
- Implement proper authentication and authorization
- Set appropriate CORS settings on your R2 bucket

## Monitoring and Troubleshooting

### Monitoring

1. Use Cloudflare Analytics to monitor traffic and performance
2. Set up alerts for unusual activity
3. Monitor R2 usage and costs

### Troubleshooting

Common issues and solutions:

- **403 Forbidden**: Check API token permissions
- **CORS errors**: Configure CORS settings on your R2 bucket
- **Slow uploads**: Check file sizes and network conditions
- **Missing files**: Verify paths and bucket names

## Best Practices

- Use unique, random filenames to prevent collisions
- Organize files in logical folder structures
- Implement file type and size validation
- Set appropriate cache headers for static assets
- Regularly backup important data
- Monitor usage and costs 