# Groops - React Native Chat App

Groops is a React Native mobile application that provides group chat functionality similar to WhatsApp and Instagram, with the added feature of threaded replies. Users can create groups, join existing groups, send messages, and reply to specific messages in threads.

## Features

- **User Authentication**: Register and login functionality
- **Group Management**: Create, join, and leave groups
- **Messaging**: Send messages in groups
- **Threaded Replies**: Reply to specific messages in threads
- **Modern UI**: Clean and intuitive user interface

## Project Structure

```
GroopsApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for state management
│   ├── navigation/     # Navigation configuration
│   └── screens/        # App screens
├── assets/             # Images and other static assets
├── App.tsx            # Main application component
└── index.ts           # Entry point
```

## Screens

- **LoginScreen**: User authentication
- **RegisterScreen**: New user registration
- **HomeScreen**: Display available groups
- **CreateGroupScreen**: Create new groups
- **GroupScreen**: View group details and messages
- **ChatScreen**: Send messages in a group
- **ThreadScreen**: View and reply to threaded messages

## State Management

The app uses React Context API for state management:

- **AuthContext**: Manages user authentication state
- **GroupContext**: Manages groups, messages, and threaded replies

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Register a new account or login with existing credentials
2. Browse available groups or create a new group
3. Send messages in groups
4. Tap on a message to view or create threaded replies

## Future Enhancements

- Real-time messaging with Firebase or WebSockets
- Media sharing (images, videos, documents)
- User profiles and avatars
- Group admin controls
- Push notifications
- End-to-end encryption