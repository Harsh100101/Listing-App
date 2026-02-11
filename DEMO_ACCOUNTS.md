# 🔐 Demo Account Credentials

## ⚠️ IMPORTANT SECURITY NOTICE

**These are DEMO accounts for development/testing only!**

### Demo Credentials for Testing

**Frontend Demo (for testing UI):**

- Email: `demo@example.com`
- Password: `demo-password-change-me`

- Email: `user@test.com`
- Password: `test-password-change-me`

- Email: `admin@admin.com`
- Password: `admin-password-change-me`

### 🚨 PRODUCTION SECURITY REQUIREMENTS

1. **Remove all demo accounts** before deploying to production
2. **Implement proper password hashing** (bcrypt, Argon2, etc.)
3. **Use environment variables** for all secrets
4. **Implement proper user registration** with email verification
5. **Add rate limiting** for login attempts
6. **Use HTTPS** for all authentication endpoints
7. **Implement proper session management**

### 🛠️ For Production Use

Replace the mock authentication system with:

- Real database (MongoDB, PostgreSQL, etc.)
- Proper password hashing algorithms
- OAuth integration (Google, Apple, etc.)
- Multi-factor authentication
- Account lockout policies
- Audit logging

**Never use these demo credentials in production!**
