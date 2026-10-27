#!/usr/bin/env python3
import subprocess, os

os.chdir("/Users/a/Desktop/untitled folder 3")

# Check git status
result = subprocess.run(["git", "status", "--short"], capture_output=True, text=True)
print("GIT STATUS:")
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[:200])

# Check current branch
result2 = subprocess.run(["git", "branch", "--show-current"], capture_output=True, text=True)
print("CURRENT BRANCH:", result2.stdout.strip())

# Check recent commits
result3 = subprocess.run(["git", "log", "--oneline", "-5"], capture_output=True, text=True)
print("RECENT COMMITS:")
print(result3.stdout)