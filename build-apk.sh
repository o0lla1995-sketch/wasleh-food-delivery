#!/usr/bin/env bash
# Wasleh APK Build Script
# Usage: ./build-apk.sh [customer|driver] [debug|release]
#
# Prerequisites:
#   - Java 17 installed (JAVA_HOME set, or use --java-home flag)
#   - Android SDK installed (ANDROID_HOME set)
#   - Android NDK 23.1.7779620 installed (auto-downloaded by Gradle on first build)
#   - For release builds: a keystore file (generate one with `keytool`)

set -e

APP="${1:-customer}"
BUILD_TYPE="${2:-debug}"

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

case "$APP" in
  customer)
    APP_DIR="$REPO_ROOT/user-side"
    APP_NAME="Wasleh Customer"
    ;;
  driver)
    APP_DIR="$REPO_ROOT/driver-app"
    APP_NAME="Wasleh Driver"
    ;;
  *)
    echo "Unknown app: $APP (use 'customer' or 'driver')"
    exit 1
    ;;
esac

echo "=== Wasleh APK Build ==="
echo "App:        $APP_NAME ($APP)"
echo "Build type: $BUILD_TYPE"
echo "App dir:    $APP_DIR"
echo ""

# Verify prerequisites
if [ -z "$JAVA_HOME" ]; then
  echo "ERROR: JAVA_HOME is not set. Install JDK 17 and set JAVA_HOME."
  exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
  echo "ERROR: ANDROID_HOME is not set. Install Android SDK and set ANDROID_HOME."
  exit 1
fi

if [ ! -f "$APP_DIR/.env" ]; then
  echo "WARNING: $APP_DIR/.env not found. Copying from .env.example..."
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo "  Edit $APP_DIR/.env with your Firebase + Google Maps keys before release."
fi

# Step 1: Install JS dependencies
echo "=== Step 1/4: Install JS dependencies ==="
cd "$APP_DIR"
yarn install

# Step 2: Generate native Android project (idempotent)
echo ""
echo "=== Step 2/4: Generate native Android project ==="
if [ ! -d "android" ]; then
  npx expo prebuild --platform android --no-install
else
  echo "  android/ already exists, skipping prebuild"
fi

# Step 3: Run Gradle build
echo ""
echo "=== Step 3/4: Run Gradle build ==="
cd android

# Ensure FLIPPER_VERSION is set (needed by Expo SDK 48)
if ! grep -q "FLIPPER_VERSION" gradle.properties; then
  echo "FLIPPER_VERSION=0.182.0" >> gradle.properties
fi

case "$BUILD_TYPE" in
  debug)
    ./gradlew :app:assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    ;;
  release)
    # For release, you need a keystore. Generate one:
    #   keytool -genkey -v -keystore wasleh.keystore -alias wasleh \
    #     -keyalg RSA -keysize 2048 -validity 10000
    # Then add to android/gradle.properties:
    #   WASLEH_UPLOAD_STORE_FILE=../wasleh.keystore
    #   WASLEH_UPLOAD_KEY_ALIAS=wasleh
    #   WASLEH_UPLOAD_STORE_PASSWORD=*****
    #   WASLEH_UPLOAD_KEY_PASSWORD=*****
    # And edit android/app/build.gradle signingConfigs.release to use them.
    ./gradlew :app:assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    ;;
  *)
    echo "Unknown build type: $BUILD_TYPE (use 'debug' or 'release')"
    exit 1
    ;;
esac

# Step 4: Locate and copy the APK
echo ""
echo "=== Step 4/4: Locate APK ==="
if [ -f "$APK_PATH" ]; then
  APK_SIZE=$(du -h "$APK_PATH" | awk '{print $1}')
  echo "✓ APK built successfully"
  echo "  Path: $APK_PATH"
  echo "  Size: $APK_SIZE"

  # Copy to download dir if available
  if [ -d "/home/z/my-project/download" ]; then
    cp "$APK_PATH" "/home/z/my-project/download/wasleh-$APP-$BUILD_TYPE.apk"
    echo "  Copied to: /home/z/my-project/download/wasleh-$APP-$BUILD_TYPE.apk"
  fi
else
  echo "✗ APK not found at $APK_PATH"
  exit 1
fi
