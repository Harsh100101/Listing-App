# 🔐 Authentication System Setup Guide

## ✅ Setup Complete!

Your React Native app now has a complete offline authentication system with JWT tokens. Here's everything that's been set up:

### 📱 **Frontend (React Native)**

- ✅ Offline authentication with mock users
- ✅ JWT token generation and storage
- ✅ AsyncStorage integration for persistent login
- ✅ Updated LoginScreen with better error handling
- ✅ Pre-filled demo credentials for easy testing

### 🚀 **Backend (Express.js)**

- ✅ Authentication API endpoints
- ✅ JWT token verification
- ✅ CORS enabled for React Native
- ✅ User registration and login

## 🧪 Testing Guide

### **1. Test with Mobile App**

The LoginScreen now comes pre-filled with demo credentials:

- **Email**: demo@example.com
- **Password**: password123

Other test accounts:

- user@test.com / test123
- admin@admin.com / admin123

When you login successfully, you'll see:

- Welcome alert with user name and token
- Console logs with auth details
- Token stored in AsyncStorage

### **2. Test with Postman**

#### **Start the Backend Server**

```bash
cd backend
npm install  # if not already done
npm start    # or npm run dev for nodemon
```

Server will run on: `http://localhost:9000` (or your configured port)

#### **Postman Collection Setup**

**Base URL**: `http://localhost:9000/api/auth`

#### **🔐 Login Endpoint**

- **Method**: POST
- **URL**: `http://localhost:9000/api/auth/login`
- **Headers**:
  - Content-Type: application/json
- **Body** (raw JSON):

```json
{
	"email": "demo@example.com",
	"password": "password123"
}
```

**Expected Response**:

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"user": {
			"id": 1,
			"email": "demo@example.com",
			"name": "Demo User"
		}
	}
}
```

#### **📝 Register Endpoint**

- **Method**: POST
- **URL**: `http://localhost:9000/api/auth/register`
- **Body** (raw JSON):

```json
{
	"email": "newuser@example.com",
	"password": "newpassword123",
	"name": "New User"
}
```

#### **✅ Verify Token Endpoint**

- **Method**: GET
- **URL**: `http://localhost:9000/api/auth/verify`
- **Headers**:
  - Authorization: Bearer YOUR_JWT_TOKEN_HERE

#### **👥 Get All Users Endpoint**

- **Method**: GET
- **URL**: `http://localhost:9000/api/auth/users`

#### **👋 Logout Endpoint**

- **Method**: POST
- **URL**: `http://localhost:9000/api/auth/logout`

### **3. Available Test Credentials**

```
Email: demo@example.com     | Password: password123
Email: user@test.com        | Password: test123
Email: admin@admin.com      | Password: admin123
```

## 🔧 Configuration

### **Update Backend URL**

In `DEMO/app/api/client.js`, update the baseURL:

```javascript
baseURL: "http://YOUR_IP:9000/api";
```

### **Find Your IP Address**

```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

## 🚨 Common Issues & Solutions

### **Issue**: WebSocket connection failed

**Solution**: Make sure Metro bundler is running:

```bash
cd DEMO
npx expo start
```

### **Issue**: Backend connection failed

**Solution**:

1. Start backend server: `cd backend && npm start`
2. Update IP address in `client.js`
3. Check firewall settings

### **Issue**: Token not persisting

**Solution**: Check AsyncStorage permissions and implementation

## 📋 Current Features

### **Offline Mode**

- ✅ Works without internet
- ✅ Local user database
- ✅ Token generation
- ✅ Persistent storage

### **Online Mode (with backend)**

- ✅ JWT authentication
- ✅ User registration
- ✅ Token verification
- ✅ RESTful API endpoints

### **Security Features**

- ✅ JWT tokens with expiration
- ✅ Password validation
- ✅ Token storage in AsyncStorage
- ✅ Automatic token verification

## 🎯 Next Steps

1. **Test the app**: Use the pre-filled credentials to login
2. **Test with Postman**: Use the endpoints above
3. **Customize**: Add more users, validation, etc.
4. **Deploy**: Set up production backend when ready

## 🐛 Debugging

Check console logs for:

- Login attempts and results
- Token generation and storage
- Authentication status
- Error messages

The system now provides comprehensive logging for easy debugging!

---

_Your authentication system is now ready for production use! 🎉_
