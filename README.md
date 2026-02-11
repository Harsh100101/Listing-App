# 📱 Listing App - React Native Marketplace

A full-stack marketplace application built with React Native (Expo) and Node.js, featuring Firebase authentication, real-time messaging, and comprehensive listing management.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 🌟 Features

### 📱 Frontend (React Native/Expo)

- **Authentication System**: Firebase-powered user registration and login
- **Listings Management**: Browse, create, edit, and delete listings
- **Image Handling**: Camera and gallery integration for listing photos
- **Real-time Messaging**: Chat functionality between users
- **Push Notifications**: Expo notifications for important updates
- **Offline Support**: Network status detection and offline handling
- **Smooth Navigation**: React Navigation with bottom tabs and stack navigation
- **Form Validation**: Formik + Yup for robust form handling
- **Animated UI**: Lottie animations for enhanced user experience

### 🖥️ Backend (Node.js/Express)

- **RESTful API**: Express.js server with organized route structure
- **File Uploads**: Image upload handling for listings
- **CORS Support**: Configured for React Native development
- **Environment Configuration**: Multiple environment support
- **Static File Serving**: Asset management for uploaded images

## 🛠️ Tech Stack

### Frontend

- **React Native** 0.81.5
- **Expo SDK** ~54.0
- **React Navigation** v7
- **Firebase** v12.9
- **Formik** & **Yup** for forms
- **Lottie React Native** for animations
- **Apisauce** for API calls
- **AsyncStorage** for local data
- **React Native Progress** for loading indicators

### Backend

- **Node.js**
- **Express.js**
- **Config** for environment management
- **CORS** support

### Development Tools

- **Expo CLI**
- **Visual Studio Code**
- **Git** for version control

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Harsh100101/Listing-App.git
   cd Listing-App
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

4. **Setup Frontend**

   ```bash
   cd DEMO
   npm install
   ```

5. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Download and configure Firebase config files
   - Update `DEMO/app/config/firebase.js` with your Firebase credentials

6. **Start the Backend Server**

   ```bash
   cd backend
   npm start
   ```

7. **Start the React Native App**
   ```bash
   cd DEMO
   expo start
   ```

## 📱 Running the App

### Development

```bash
# Start Metro bundler
cd DEMO
expo start

# Run on Android
expo start --android

# Run on iOS
expo start --ios

# Run on web
expo start --web
```

### Backend Development

```bash
cd backend
npm start
```

## 📁 Project Structure

```
├── 📱 DEMO/                     # React Native Frontend
│   ├── App.js                   # Main app component
│   ├── app/
│   │   ├── api/                 # API layer
│   │   ├── auth/                # Authentication modules
│   │   ├── components/          # Reusable components
│   │   ├── navigation/          # App navigation
│   │   ├── screen/              # Screen components
│   │   ├── services/            # Firebase services
│   │   └── utility/             # Helper functions
│   └── package.json
│
├── 🖥️ backend/                  # Node.js Backend
│   ├── index.js                 # Server entry point
│   ├── config/                  # Environment configs
│   ├── routes/                  # API routes
│   ├── public/assets/           # Static assets
│   └── package.json
│
└── 📄 README.md                 # This file
```

## 🔧 Configuration

### Backend Configuration

The backend uses the `config` package for environment management:

- `backend/config/default.json` - Default configuration
- `backend/config/development.json` - Development settings
- `backend/config/production.json` - Production settings

### Frontend Configuration

- `DEMO/app/config/firebase.js` - Firebase configuration
- `DEMO/app/config/colors.js` - App color scheme
- `DEMO/app/config/styles.js` - Global styles

## 🔥 Firebase Setup

This app integrates with Firebase for:

- **Authentication**: User registration and login
- **Firestore**: Database for listings and user data
- **Storage**: Image storage for listings
- **Messaging**: Push notifications

Refer to the included Firebase documentation files in `/DEMO` for detailed setup instructions:

- `FIREBASE_SETUP.md`
- `FIREBASE_STEP_BY_STEP.md`
- `AUTHENTICATION_GUIDE.md`

## 📱 App Screens

- **Welcome Screen**: App introduction and navigation
- **Authentication**: Login and registration
- **Listings**: Browse and search listings
- **Listing Details**: Detailed view with images
- **Create/Edit Listing**: Add or modify listings
- **Messages**: Real-time chat functionality
- **Account**: User profile and settings
- **My Listings**: User's created listings

## 🎨 UI Components

The app includes custom, reusable components:

- **AppButton**: Styled button component
- **AppTextInput**: Custom text input with validation
- **AppPicker**: Custom picker component
- **Card**: Listing card component
- **ImageInput**: Camera/gallery image picker
- **Forms**: Complete form handling system with validation

## 🔔 Push Notifications

Implemented using Expo Notifications:

- User registration for push tokens
- Real-time message notifications
- Listing update alerts

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Listings

- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Check the GitHub Issues page for current known issues
- Report new bugs through GitHub Issues

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

## 🎯 Future Enhancements

- [ ] Advanced search and filtering
- [ ] User rating and review system
- [ ] Payment integration
- [ ] Geolocation-based listings
- [ ] Social media integration
- [ ] Multi-language support

---

**Built with ❤️ using React Native and Firebase**

_Happy coding! 🚀_
