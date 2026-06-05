#!/bin/bash
# deploy-rules.sh — Deploys Firestore security rules to Firebase
#
# Prerequisites:
#   1. npm install -g firebase-tools
#   2. firebase login
#   3. Run this script from the project root
#
# Usage: chmod +x deploy-rules.sh && ./deploy-rules.sh

set -e

echo "============================================"
echo "  QuoteWise — Deploy Firestore Rules"
echo "============================================"
echo ""

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null 2>&1; then
    echo "You need to log in to Firebase first."
    echo "Running: firebase login"
    firebase login
fi

# Select the project
echo ""
echo "Using Firebase project: gen-lang-client-0586186311"
firebase use gen-lang-client-0586186311

# Deploy only Firestore rules
echo ""
echo "Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo ""
echo "============================================"
echo "  Firestore rules deployed successfully!"
echo "============================================"
echo ""
echo "If this is the first time, you may also need to:"
echo "  1. Create Firestore Database (if not done):"
echo "     Firebase Console → Build → Firestore Database → Create Database"
echo ""
echo "  2. Enable Anonymous Authentication (for seed.js):"
echo "     Firebase Console → Authentication → Sign-in method → Enable Anonymous"
echo ""
echo "  3. Seed the database:"
echo "     node seed.js"
echo ""
