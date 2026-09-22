#!/usr/bin/env python3
"""
Patch android/gradle.properties to:
1. Add FLIPPER_VERSION (needed by Expo SDK 48)
2. Explicitly set expo.jsEngine=jsc (force JSC, not Hermes)
3. Disable Hermes explicitly to prevent bytecode mismatch
"""
import sys
from pathlib import Path

gradle_props = Path("gradle.properties")
if not gradle_props.exists():
    print("ERROR: gradle.properties not found in current directory", file=sys.stderr)
    sys.exit(1)

content = gradle_props.read_text()

# Add FLIPPER_VERSION if missing
if "FLIPPER_VERSION" not in content:
    content += "\nFLIPPER_VERSION=0.182.0\n"
    print("Added FLIPPER_VERSION=0.182.0")

# Force JSC engine (NOT Hermes) - prevents bytecode mismatch crash
if "expo.jsEngine" not in content:
    content += "\nexpo.jsEngine=jsc\n"
    print("Added expo.jsEngine=jsc")
elif "expo.jsEngine=hermes" in content:
    content = content.replace("expo.jsEngine=hermes", "expo.jsEngine=jsc")
    print("Changed expo.jsEngine from hermes to jsc")

# Explicitly disable Hermes
if "hermesEnabled" not in content:
    content += "\nhermesEnabled=false\n"
    print("Added hermesEnabled=false")
elif "hermesEnabled=true" in content:
    content = content.replace("hermesEnabled=true", "hermesEnabled=false")
    print("Changed hermesEnabled from true to false")

gradle_props.write_text(content)
print("gradle.properties patched successfully")
print("\nFinal content:")
print(content)
