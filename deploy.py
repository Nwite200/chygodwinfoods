#!/usr/bin/env python3
import subprocess

result = subprocess.run(
    ["npx", "wrangler", "deploy"],
    capture_output=True,
    text=True,
    cwd="/Users/a/Desktop/untitled folder 3"
)
print("STDOUT:")
print(result.stdout)
print("\nSTDERR:")
print(result.stderr[:500] if result.stderr else "")
print("\nReturn code:", result.returncode)