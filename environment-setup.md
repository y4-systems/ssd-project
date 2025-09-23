# Environment Configuration Setup

## Required .env Files

Create `.env` file in **each backend directory** with these variables:

### 1. budgetapp/backend/.env

```bash
NODE_ENV=development
PORT=7000
MONGODB_URL=mongodb://localhost:27017/wedding_budget
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-budget
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-budget
```

### 2. eventapp/backend/.env

```bash
NODE_ENV=development
PORT=5003
MONGO_CONNECTION_STRING=mongodb://localhost:27017/wedding_events
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-events
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-events
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback
FRONTEND_URL=http://localhost:3003
```

### 3. guestapp/backend/.env

```bash
NODE_ENV=development
PORT=5002
MONGO_URL=mongodb://localhost:27017/wedding_guests
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-guests
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-guests
```

### 4. mainapp/backend/.env

```bash
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb://localhost:27017/wedding_main
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-main
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-main
```

### 5. packageapp/backend/.env

```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/wedding_packages
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-packages
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-packages
```

### 6. vendorapp/backend/.env

```bash
NODE_ENV=development
PORT=5001
MONGO_URL=mongodb://localhost:27017/wedding_vendors
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-vendors
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-vendors
SECRET_KEY=your-vendor-specific-secret-key-minimum-32-characters
```

### 7. feedbackapp/backend/.env

```bash
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/wedding_feedback
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-feedback
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-feedback
ADMIN_PASSWORD=your-admin-password-for-basic-auth
```

### 8. taskapp/backend/.env

```bash
NODE_ENV=development
PORT=8080
MONGO_URL=mongodb://localhost:27017/wedding_tasks
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-tasks
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-tasks
FRONTEND_DOMAIN=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
FACEBOOK_CLIENT_ID=your-facebook-oauth-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-oauth-client-secret
```

## Security Requirements

### Secret Key Generation

Use this command to generate secure keys:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create separate databases for each service
3. Ensure MongoDB authentication is enabled in production

### OAuth Setup

1. Create Google OAuth application at: https://console.cloud.google.com/
2. Create Facebook OAuth application at: https://developers.facebook.com/
3. Set appropriate callback URLs

## Installation Script

Create this script to set up all environments:

```bash
#!/bin/bash
# setup-env.sh

# Generate a secure key
generate_key() {
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Create .env files for each backend
backends=("budgetapp" "eventapp" "guestapp" "mainapp" "packageapp" "vendorapp" "feedbackapp" "taskapp")

for backend in "${backends[@]}"; do
    if [ -d "${backend}/backend" ]; then
        echo "Setting up ${backend}/backend/.env"
        # Copy template and replace placeholders
        # (Implementation depends on your setup)
    fi
done

echo "Environment setup complete!"
echo "Remember to:"
echo "1. Update all placeholder values with actual secrets"
echo "2. Set up OAuth applications"
echo "3. Configure MongoDB connection strings"
echo "4. Never commit .env files to version control"
```

## Verification

Test your setup:

```bash
# Check each backend can start
cd budgetapp/backend && npm start
cd eventapp/backend && npm start
# ... etc for each backend
```

**IMPORTANT**: Never commit `.env` files to version control!
