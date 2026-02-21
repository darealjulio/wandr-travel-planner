# Wandr Travel Planner

AI-powered travel planner mobile app built with Expo/React Native.
Tracks the UWG Greece Study Abroad trip (March 14-22, 2026).

## Features
- Greece Study Abroad trip tracker (Mar 14-22, 2026)
- 9-day detailed itinerary with all site locations
- Dark theme with amber/gold accents
- Trip management with AsyncStorage caching
- 4-tab navigation (Home, Explore, My Trips, Profile)

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Expo CLI: `npm install -g expo`
- Expo Go app on your phone (from App Store or Google Play)

### Setup
```bash
# Clone the repo
git clone https://github.com/darealjulio/wandr-travel-planner.git
cd wandr-travel-planner

# Install dependencies
npm install
# or
bun install

# Start the dev server
npx expo start
```

### Run on your phone
1. Open Expo Go on your phone
2. Scan the QR code from the terminal
3. The app will load with your Greece trip as "Next Adventure"

### With Claude Code
```bash
claude
```
Then ask Claude to modify the app, update trip data, or add new features.

## Trip Data
- **Greece** (Mar 14-22, 2026) - UWG Study Abroad, 26 travelers - UPCOMING
- Kyoto (Apr 9-16, 2025) - Completed
- Santorini (Jul 15-22, 2025) - Completed

## Greece Itinerary Highlights
- Day 1 (Mar 14): Depart Atlanta
- Day 2 (Mar 15): Ancient Corinth
- Day 3 (Mar 16): Acropolis, Areopagus Hill, Ancient Agora, Monastiraki
- Day 4 (Mar 17): SNFCC
- Day 5 (Mar 18): Thessaloniki, Rotonda
- Day 6 (Mar 19): Archaeological Site of Philippi
- Day 7 (Mar 20): Mount Athos
- Day 8 (Mar 21): Patmos - Holy Cave of Apocalypse, Monastery of St John
- Day 9 (Mar 22): Return Home

## Tech Stack
- Expo SDK 54
- Expo Router (file-based routing)
- React Native
- TypeScript
- AsyncStorage
- @tanstack/react-query
```
