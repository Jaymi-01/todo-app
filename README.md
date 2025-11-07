To-Do App (Expo & Convex)

This is a modern, cross-platform mobile and web application for managing tasks. It features real-time data synchronization using Convex as the backend, dual light/dark theming, and drag-and-drop reordering.

🚀 Core Technologies

Frontend: React Native (Expo SDK)

Styling: React Native Stylesheet (Responsive Layout)

Database: Convex (Real-time CRUD and State Management)

Gestures: react-native-draggable-flatlist (for task reordering)

Typography: Josefin Sans font family

🛠️ Setup and Installation

1. Prerequisites

Node.js (LTS version)

Expo CLI (npm install -g expo-cli)

EAS CLI (npm install -g eas-cli)

Convex CLI (npm install -g convex-cli)

2. Project Initialization

Clone the repository:
```
git clone [Jaymi-01/todo-app]
cd todo-app
```

Install dependencies:
```
npm install
```

Install Native Dependencies (Crucial for Drag/Drop):
```
npx expo install react-native-reanimated react-native-gesture-handler react-native-svg react-native-draggable-flatlist
```

3. Convex Backend Setup

Log in to Convex and initialize the project:
```
convex init
```
# Follow the prompts to link to your Convex deployment.


Deploy Functions: Ensure the todos.ts file (containing getTodos, addTodo, toggleTodo, deleteTodo, clearCompleted, and setOrder) is deployed.
```
npx convex deploy
```

Set Environment Variable: Ensure your Convex URL is set in your Expo configuration:

# In a local .env file or manually configure in app.json
EXPO_PUBLIC_CONVEX_URL="YOUR_CONVEX_URL_HERE"


🏃 Running the Application

Development Mode

Start the Metro bundler:
```
npx expo start
```

Scan the QR code with the Expo Go app for iOS/Android testing.

Press w to view the app on the web.

Production Build (Deployment)

Use EAS Build to create installable native binaries:

Android (.apk):
```
eas build -p android --profile production
```

(Note: This profile is set to generate an .apk file for direct sharing.)

iOS (.ipa):
```
eas build -p ios --profile production
```

✅ Features Implemented

Theme Switching: Persistent Light/Dark mode.

CRUD: Create, Read, Update (toggle), and Delete tasks.

Filtering: Filter tasks by All, Active, and Completed states.

Reordering: Real-time Drag and Drop reordering persisted via the setOrder Convex mutation.
