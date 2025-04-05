### Status
![Static Badge](https://img.shields.io/badge/build-passing-brightgreen)  ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/monsimb/Capstone_RuneRoutes/main?link=https%3A%2F%2Fgithub.com%2Fmonsimb%2FCapstone_RuneRoutes%2Ftree%2Fmain%23)

### Using
![Static Badge](https://img.shields.io/badge/npm_package-10.9.0-red)  ![Static Badge](https://img.shields.io/badge/ReactNative-0.76.1-lightblue)  ![Static Badge](https://img.shields.io/badge/turf-7.2.0-green)  ![Static Badge](https://img.shields.io/badge/mongodb-6.15.0-darkgreen)



# RuneRoutes: Gamifying Real-World Exploration

**RuneRoutes** is an innovative mobile application that transforms everyday travel into a fantasy adventure through an interactive "fog of war" mechanic. Built using **React Native** and **TypeScript**, the app allows users to uncover new areas as they navigate the real world, place custom Points of Interest (POIs) with images and descriptions, and share discoveries with friends.

The application embraces a fantasy theme throughout its design, with the name "RuneRoutes" reflecting the magical, RPG inspired journey of discovery. Users can personalize their exploration experience by selecting custom character icons, adding a role-playing element to the navigation experience. As explorers venture into uncharted territories, they reveal hidden realms on their map, dsicover points of interest, and build their own legendary path through the world around them.

## Technical Features

- **Interactive Map System**: Integrated Mapbox API for advanced map visualization
- **Fog of War**: Custom raycasting algorithm reveals areas as you explore them
- **Points of Interest**: Place and discover custom markers with images and descriptions
- **Friend System**: Share discoveries and compete with friends
- **Custom Characters**: Personalize your explorer with unique character icons

## Planned Features

- **Competition**: 
- **Driving mode**:
- **Journeys**:

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions up to the "Creating a new application" step before proceeding.

### Step 1: Start the Metro Server

Metro is the JavaScript *bundler* that ships *with* React Native.

From the root of your React Native project, run:

```bash
# using npm
npm start
# OR using Yarn
yarn start


### Step 2: Start your Application

Let Metro Bundler run in its own terminal. Open a new terminal from the root of your React Native project.

To start the app:

#### For Android:

```bash
# using npm
npm run android
# OR using Yarn
yarn android
```

#### For iOS:

```bash
# using npm
npm run ios
# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator or iOS Simulator. You can also run it directly from Android Studio or Xcode.

### Step 3: Modifying your App

Now that the app is running, open any of the `.tsx` files in your preferred code editor and make changes.

- For **Android**: Press <kbd>R</kbd> twice or open the Developer Menu with <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS), then select **Reload**.
- For **iOS**: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the Simulator.

## Technologies Used

- **Frontend**: React Native, TypeScript, StyleSheet
- **Maps & Location**: Mapbox API, React Native Location
- **Backend**: MongoDB Atlas, Terraform (for infrastructure provisioning)
- **Authentication**: Auth0 integration
- **Media Integration**: React Native Image Picker for photo uploads

## Troubleshooting

If you run into issues, refer to the official [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
