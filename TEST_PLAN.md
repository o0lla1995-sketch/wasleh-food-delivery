# Wasleh — Comprehensive Test Plan

> This document defines the full end-to-end test plan for the Wasleh food delivery platform.
> It covers the customer app, driver app, restaurant dashboard, real-time maps & tracking,
> notifications, and the full order lifecycle from creation to delivery.

---

## 1. Test Scope

| Module | What we test | Tools |
|---|---|---|
| Customer App (Expo RN) | Auth, browse, cart, checkout, order tracking | Expo Go / Android emulator / physical device |
| Driver App (Expo RN) | Auth, accept order, navigation, status flow | Expo Go / Android emulator / physical device |
| Restaurant Dashboard (Next.js) | Auth, order management, menu management | Browser + Firebase emulator |
| Maps & Tracking | GPS, route, ETA, real-time driver position | Physical device with GPS (recommended) |
| Notifications | Firestore onSnapshot real-time sync | Manual |
| Order Lifecycle | End-to-end flow READY → ACCEPTED → PICKED_UP → COMPLETE | All three apps running in parallel |

---

## 2. Pre-flight Setup

### 2.1 Firebase Project

1. Create a new Firebase project at <https://console.firebase.google.com>.
2. Enable **Authentication** → Email/Password + Google providers.
3. Enable **Cloud Firestore** in production mode (or test mode for development).
4. Add these Firestore security rules (minimal safe starter):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /restaurants/{restaurantId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /dishes/{dishId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /orders/{orderId} {
         allow read, write: if request.auth != null;
       }
       match /orderDishes/{orderDishId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. Register 3 Android apps in Firebase with package names:
   - `com.wasleh.customer`
   - `com.wasleh.driver`
   - (Restaurant dashboard is a web app — register a web app instead)

6. Download `google-services.json` for the customer and driver apps, place them at:
   - `user-side/google-services.json`
   - `driver-app/google-services.json`

### 2.2 Google Maps API Key

1. Create a Google Cloud project at <https://console.cloud.google.com>.
2. Enable: **Maps SDK for Android**, **Maps SDK for iOS**, **Directions API**, **Geocoding API**.
3. Create an API key.
4. Restrict the key:
   - Android apps with SHA-1 fingerprint + package names `com.wasleh.customer` and `com.wasleh.driver`
   - APIs: Maps SDK for Android, Directions API
5. Copy the key into:
   - `user-side/.env` → `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...`
   - `driver-app/.env` → `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...`

### 2.3 Environment Files

```bash
cp user-side/.env.example user-side/.env
cp driver-app/.env.example driver-app/.env
cp restaurant-dashboard/.env.local.example restaurant-dashboard/.env.local
# Then edit each .env file with your own Firebase + Maps keys
```

### 2.4 Seed Data

The customer app reads from `user-side/assets/featuredData.json` and Firestore. Create at least:
- 1 restaurant document in `restaurants` collection
- 3-5 dish documents in `dishes` collection referencing that restaurant
- Sample categories in Firestore if your app uses them

---

## 3. Module Tests

### 3.1 Customer App

| ID | Test | Steps | Expected Result | Pass |
|---|---|---|---|---|
| CU-01 | Sign Up | Open app → tap "Sign Up" → enter email/password/confirm | Account created in Firebase Auth, user redirected to home | ☐ |
| CU-02 | Sign In | Open app → tap "Sign In" → enter credentials | User signed in, redirected to home | ☐ |
| CU-03 | Browse Restaurants | From home, scroll restaurants list | All restaurants from Firestore render with image, name, rating | ☐ |
| CU-04 | Search Restaurant | Tap search bar → type "Pizza" | Filtered results show only matching restaurants | ☐ |
| CU-05 | View Restaurant Details | Tap any restaurant card | RestaurantDetails screen opens with menu items | ☐ |
| CU-06 | Add Dish to Cart | From restaurant details → tap "+" on a dish | Basket icon badge increments, item appears in BasketScreen | ☐ |
| CU-07 | Modify Cart Quantity | Open BasketScreen → +/- buttons | Quantity and total update correctly | ☐ |
| CU-08 | Checkout | From BasketScreen → tap "Place Order" | PreparingOrderScreen shows, then OrderDetailsScreen | ☐ |
| CU-09 | View Order History | From profile → tap "My Orders" | All past orders listed with status | ☐ |
| CU-10 | Real-time Order Status | After placing order, observe status field | Status changes: READY → DRIVERACCEPTED → DRIVERPICKEDUP → COMPLETE | ☐ |
| CU-11 | Sign Out | Profile → Sign Out | User returned to Sign In screen, Auth state cleared | ☐ |

### 3.2 Driver App

| ID | Test | Steps | Expected Result | Pass |
|---|---|---|---|---|
| DR-01 | Driver Sign In | Open driver app → sign in | Driver lands on OrdersScreen with map | ☐ |
| DR-02 | Location Permission | First launch → grant location permission | Map shows current driver location as blue dot | ☐ |
| DR-03 | Available Orders List | On OrdersScreen, view bottom sheet | List of orders with status `READY` from Firestore | ☐ |
| DR-04 | Order Markers on Map | Look at map | Each available order has a green shop marker at restaurant location | ☐ |
| DR-05 | Accept Order | Tap an order → "Accept Order ✅" | Status changes to `DRIVERACCEPTED`, route drawn from driver → restaurant | ☐ |
| DR-06 | Pickup Order | After arriving at restaurant → "Pick-Up Order 🛵" | Status changes to `DRIVERPICKEDUP`, route drawn to customer location | ☐ |
| DR-07 | Complete Delivery | After arriving at customer → "Payment Received 💵" → "Complete Delivery 🎉" | Status changes to `COMPLETE`, driver returned to OrdersScreen | ☐ |
| DR-08 | Live Driver Position | While delivery in progress, observe driver marker | Driver marker moves in real-time as device moves (every 100m) | ☐ |
| DR-09 | Route ETA & Distance | While navigating, view bottom sheet | Total minutes and total km update based on Google Directions API response | ☐ |
| DR-10 | Background Location | Switch app to background, move | Location subscription continues (requires `expo-location` foreground service) | ☐ |

### 3.3 Restaurant Dashboard

| ID | Test | Steps | Expected Result | Pass |
|---|---|---|---|---|
| RD-01 | Dashboard Load | Visit `http://localhost:3000` | Login screen or dashboard renders without errors | ☐ |
| RD-02 | Restaurant Sign In | Enter credentials | Sidebar appears with restaurant name from Firestore | ☐ |
| RD-03 | View Incoming Orders | Click "Orders" in sidebar | Orders list shows pending orders with customer name, address, total | ☐ |
| RD-04 | Accept Order | Click "Accept" on an order | Order status changes in Firestore, customer + driver see update in real-time | ☐ |
| RD-05 | Mark Order Ready | After accepting → "Mark Ready" | Order status becomes `READY`, order becomes available to drivers | ☐ |
| RD-06 | View Order Modal | Click order row | Modal opens with dish details and customer info | ☐ |
| RD-07 | Menu Management | Click "Menu" → add a new dish | New dish appears in Firestore `dishes` collection and in customer app | ☐ |
| RD-08 | Edit Dish | Click existing dish → edit price | Updated price reflected immediately in customer app | ☐ |
| RD-09 | Delete Dish | Click trash icon on dish | Dish removed from Firestore and no longer shown in customer app | ☐ |
| RD-10 | Order History | Click "Order History" | Past completed/cancelled orders shown with timestamps | ☐ |
| RD-11 | Settings | Click "Settings" | Restaurant info editable (name, image, delivery fee) | ☐ |

### 3.4 Maps & Real-time Tracking

| ID | Test | Steps | Expected Result | Pass |
|---|---|---|---|---|
| MP-01 | Map Renders | Open driver app OrdersScreen | Map renders with tile layer visible | ☐ |
| MP-02 | Driver Location Accuracy | Compare driver blue dot with actual GPS | Location within ~10m accuracy | ☐ |
| MP-03 | Restaurant Markers | With orders available | Each order's restaurant location has green marker | ☐ |
| MP-04 | Route Drawing | Accept an order | Green polyline drawn from driver → destination | ☐ |
| MP-05 | Route Recalculation | Move 100m+ | Route polyline updates, ETA recalculates | ☐ |
| MP-06 | Customer Side Tracking | After driver accepts | Customer should see order status updates (if customer app tracks position) | ☐ |
| MP-07 | Background Tracking | Background the driver app, move | Firestore driver position document updates periodically | ☐ |
| MP-08 | Multi-driver Scenario | Two drivers accept different orders | No interference, each driver sees only their order route | ☐ |

### 3.5 Notifications & Real-time Sync

| ID | Test | Steps | Expected Result | Pass |
|---|---|---|---|---|
| NT-01 | New Order → Driver | Customer places order | Order appears in driver's available list within ~2 seconds | ☐ |
| NT-02 | Driver Accept → Restaurant | Driver accepts order | Restaurant dashboard shows status change in real-time | ☐ |
| NT-03 | Driver Accept → Customer | Driver accepts order | Customer's "My Orders" screen shows new status | ☐ |
| NT-04 | Restaurant Ready → Driver | Restaurant marks ready | Order becomes available in driver's list | ☐ |
| NT-05 | Driver Pickup → Customer | Driver picks up order | Customer sees "DRIVERPICKEDUP" status | ☐ |
| NT-06 | Driver Complete → All | Driver completes delivery | Restaurant sees order in history, customer sees "COMPLETE" | ☐ |
| NT-07 | App Backgrounded | Background customer app, accept order | On foreground, customer sees updated status (Firestore onSnapshot resumes) | ☐ |
| NT-08 | Connection Loss | Disable internet during order | UI doesn't crash, on reconnect syncs latest state | ☐ |

---

## 4. End-to-End Order Flow Test

This is the **single most important test**. Run all three apps simultaneously.

### Setup
- Customer app on physical device A (or emulator)
- Driver app on physical device B (with GPS) — different device recommended
- Restaurant dashboard open in browser
- All three apps signed in to the same Firebase project

### Steps

1. **Restaurant**: Sign in to dashboard. Add a dish "Test Pizza — $10" to the menu if not present.
2. **Customer**: Sign in, browse restaurants, find the restaurant, add "Test Pizza" to cart.
3. **Customer**: Tap basket → "Place Order". Note the order ID shown in customer's "My Orders".
4. **Restaurant**: Within 2 seconds, the new order appears in the dashboard with status `PENDING`.
5. **Restaurant**: Click "Accept" on the order. Verify customer and driver see status update.
6. **Restaurant**: Click "Mark Ready for Pickup". Verify status becomes `READY`.
7. **Driver**: Within 2 seconds, the order appears in driver's available orders list as a marker on the map.
8. **Driver**: Tap the order in the bottom sheet. OrderDelivery screen opens.
9. **Driver**: Tap "Accept Order ✅". Status → `DRIVERACCEPTED`. Route draws from driver → restaurant.
10. **Driver**: Travel to restaurant (or simulate movement). Observe ETA/distance updating.
11. **Driver**: Tap "Pick-Up Order 🛵". Status → `DRIVERPICKEDUP`. Route draws to customer.
12. **Customer**: Verify customer's order status updates in real-time.
13. **Driver**: Travel to customer location.
14. **Driver**: Tap "Payment Received 💵" then "Complete Delivery 🎉".
15. **Verify**: Status → `COMPLETE`. Driver returned to OrdersScreen. Customer sees delivered status. Restaurant sees order in Order History.

### Pass Criteria
- All 4 status transitions happened within ~3 seconds across all three clients.
- No app crashed during the flow.
- Map showed correct route at each stage.
- Driver location updated live during transit.

---

## 5. Non-functional Tests

### 5.1 Performance

| ID | Test | Expected | Pass |
|---|---|---|---|
| PF-01 | App cold start time | < 3 seconds on mid-range Android device | ☐ |
| PF-02 | Restaurant list scroll | 60 FPS, no jank | ☐ |
| PF-03 | Map interaction (pan/zoom) | Smooth, no frame drops | ☐ |
| PF-04 | Order placement latency | Order visible to driver within 2 seconds | ☐ |

### 5.2 Compatibility

| ID | Test | Devices | Pass |
|---|---|---|---|
| CP-01 | Android 11+ | Pixel 3 or newer emulator | ☐ |
| CP-02 | Android 14 | Physical device or API 34 emulator | ☐ |
| CP-03 | Tablet | Pixel Tab emulator | ☐ |
| CP-04 | Browser (dashboard) | Chrome, Firefox, Safari, Edge | ☐ |

### 5.3 Security (Post-Branding Checklist)

| ID | Test | Expected | Pass |
|---|---|---|---|
| SE-01 | No API keys in source | `grep -r "AIza" --include="*.js" --include="*.jsx" .` returns only env.example files | ☐ |
| SE-02 | `.env` files gitignored | `git status` does not show `.env` | ☐ |
| SE-03 | Firebase rules deployed | Firestore rules in production mode, only allow authenticated reads/writes | ☐ |
| SE-04 | Google Maps key restricted | Key in Google Cloud Console restricted to your apps' package names + SHA-1 | ☐ |

---

## 6. APK Build Verification

### Local Build (preferred when you have Android Studio)

```bash
# 1. Make sure Android Studio + SDK + NDK 23.1.7779620 are installed
# 2. Set environment:
export JAVA_HOME=/path/to/jdk17
export ANDROID_HOME=/path/to/Android/Sdk

# 3. Generate native project (one-time)
cd user-side
npx expo prebuild --platform android --no-install

# 4. Build debug APK
cd android
./gradlew :app:assembleDebug

# 5. Find APK at:
ls app/build/outputs/apk/debug/app-debug.apk
```

### EAS Build (Cloud — Recommended)

EAS Build is Expo's cloud build service. It produces signed APK/AAB without needing a local Android SDK setup.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login (free Expo account)
eas login

# 3. Initialize EAS project (one-time)
cd user-side
eas build:configure

# 4. Build debug APK
eas build --profile preview --platform android

# 5. Download the APK from the URL EAS prints at the end
```

Repeat for the driver app:

```bash
cd driver-app
eas build --profile preview --platform android
```

### Production AAB (for Google Play)

```bash
cd user-side
eas build --profile production --platform android
# Upload the .aab to Google Play Console
```

---

## 7. Deployment Verification (Coolify)

After deploying the restaurant dashboard to Coolify:

1. Visit `https://your-coolify-domain/` — should load the login screen.
2. Verify env vars are set in Coolify's "Environment Variables" tab (especially `NEXT_PUBLIC_FIREBASE_*`).
3. Run `docker compose logs -f wasleh-dashboard` — check for errors.
4. Healthcheck: `curl https://your-coolify-domain/` returns 200 OK.
5. Test login → verify Firestore connection works from the deployed container.

---

## 8. Bug Report Template

When a test fails, document:

```
Test ID: CU-05
Test Name: View Restaurant Details
Reproduction:
  1. ...
  2. ...
Expected: ...
Actual: ...
Logs: (paste relevant console / logcat output)
Device: ...
Build: commit SHA / APK version
```

---

## 9. Sign-off

| Module | Tester | Date | Result |
|---|---|---|---|
| Customer App | | | PASS / FAIL |
| Driver App | | | PASS / FAIL |
| Restaurant Dashboard | | | PASS / FAIL |
| Maps & Tracking | | | PASS / FAIL |
| Notifications | | | PASS / FAIL |
| E2E Order Flow | | | PASS / FAIL |
| APK Build | | | PASS / FAIL |
| Deployment | | | PASS / FAIL |
