#!/usr/bin/env python3
"""
Patch android/app/build.gradle to add a release signingConfig that uses
the wasleh.keystore (password: wasleh123).

Run from inside the android/app/ directory.
"""
import sys
from pathlib import Path

build_gradle = Path("build.gradle")
if not build_gradle.exists():
    print("ERROR: build.gradle not found in current directory", file=sys.stderr)
    sys.exit(1)

content = build_gradle.read_text()

# Already patched?
if "signingConfigs.release" in content and "signingConfig signingConfigs.release" in content:
    print("build.gradle already has release signing config")
    sys.exit(0)

# 1. Add release block to signingConfigs
old_signing = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }"""

new_signing = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file('wasleh.keystore')
            storePassword 'wasleh123'
            keyAlias 'wasleh'
            keyPassword 'wasleh123'
        }
    }"""

if old_signing in content:
    content = content.replace(old_signing, new_signing)
    print("Added release block to signingConfigs")
else:
    print("WARN: Could not find expected signingConfigs block (may already be patched)")

# 2. Change release buildType to use signingConfigs.release instead of debug
old_release = """        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug"""

new_release = """        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.release"""

if old_release in content:
    content = content.replace(old_release, new_release)
    print("Updated release buildType to use signingConfigs.release")
else:
    print("WARN: Could not find release buildType block (may already be patched)")

build_gradle.write_text(content)
print("build.gradle patched successfully")
