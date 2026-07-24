# PrayerHub

A community prayer application built with React + Vite, backed by Firebase (Firestore + Anonymous Auth).

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend / Database**: Firebase Firestore
- **Auth**: Firebase Anonymous Authentication

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/JonahMasanga/pray.git
cd pray
npm install
```

### 2. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a **Web app** inside the project.
3. Copy the Firebase configuration object shown after registration.

### 3. Enable Firestore

In the Firebase Console:
- Navigate to **Build → Firestore Database**
- Click **Create database** and choose **Start in test mode** for development (remember to secure with rules before going to production)

### 4. Enable Anonymous Authentication

In the Firebase Console:
- Navigate to **Build → Authentication → Sign-in method**
- Enable **Anonymous** sign-in

### 5. Configure environment variables

Copy the example env file and fill in your Firebase config values:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

### 6. Set up Firestore indexes

The app queries collections with `orderBy('created_date', 'desc')` and (for comments) a combined `where + orderBy`. Create a composite index for the `comments` collection:

| Collection | Fields indexed |
|---|---|
| `comments` | `prayer_request_id` ASC, `created_date` DESC |

You can create this index via the Firebase Console (**Firestore → Indexes → Add index**) or by deploying the included `firestore.indexes.json` if present.

### 7. Firestore security rules (production)

Before going to production, replace the default test-mode rules with proper security rules. Example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 8. Run the development server

```bash
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Firestore Collections

| Collection | Description |
|---|---|
| `prayerRequests` | Community prayer requests |
| `testimonies` | Answered prayer testimonies |
| `communityPosts` | Community discussion posts |
| `comments` | Comments/encouragements on prayer requests |
