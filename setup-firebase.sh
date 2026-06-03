#!/bin/bash
# setup-firebase.sh — QuoteWise Firebase Setup Script
# Run this script ONCE to configure Firebase for the app.
#
# Prerequisites:
#   - Node.js 18+ installed
#   - A Google account with access to the Firebase project
#
# Usage: chmod +x setup-firebase.sh && ./setup-firebase.sh

echo "======================================================"
echo "  QuoteWise — Firebase Setup"
echo "======================================================"
echo ""
echo "This script will guide you through setting up Firebase"
echo "for the QuoteWise application."
echo ""

# Step 1: Install Firebase CLI
echo "━━━ Step 1: Install Firebase CLI ━━━"
if command -v firebase &> /dev/null; then
    echo "Firebase CLI already installed: $(firebase --version)"
else
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    echo "Installed: $(firebase --version)"
fi
echo ""

# Step 2: Login to Firebase
echo "━━━ Step 2: Login to Firebase ━━━"
echo "A browser window will open. Sign in with your Google account."
firebase login
echo ""

# Step 3: Select the project
echo "━━━ Step 3: Select Firebase Project ━━━"
echo "Using project: gen-lang-client-0586186311"
firebase use gen-lang-client-0586186311
echo ""

# Step 4: Create Firestore Database (if not exists)
echo "━━━ Step 4: Firestore Database ━━━"
echo "IMPORTANT: If you haven't created the Firestore database yet:"
echo "  1. Go to https://console.firebase.google.com"
echo "  2. Select project: gen-lang-client-0586186311"
echo "  3. Click 'Build' → 'Firestore Database' → 'Create Database'"
echo "  4. Choose 'Start in Test Mode' (we'll deploy proper rules next)"
echo "  5. Select a location (e.g. europe-west1 or africa-south1)"
echo ""
read -p "Have you created the Firestore database? (y/n): " CREATED
if [ "$CREATED" != "y" ]; then
    echo "Please create the Firestore database first, then re-run this script."
    exit 1
fi
echo ""

# Step 5: Deploy Firestore Rules
echo "━━━ Step 5: Deploy Firestore Rules ━━━"
echo "Deploying security rules from firestore.rules..."
firebase deploy --only firestore:rules
if [ $? -eq 0 ]; then
    echo "Firestore rules deployed successfully!"
else
    echo "Failed to deploy rules. Trying alternative method..."
    echo ""
    echo "Please paste the following rules into the Firebase Console:"
    echo "  1. Go to https://console.firebase.google.com"
    echo "  2. Select project: gen-lang-client-0586186311"
    echo "  3. Click 'Build' → 'Firestore Database' → 'Rules' tab"
    echo "  4. Replace the rules with the content of firestore.rules"
    echo "  5. Click 'Publish'"
    echo ""
    echo "Content of firestore.rules:"
    echo "---"
    cat firestore.rules
    echo "---"
fi
echo ""

# Step 6: Enable Authentication
echo "━━━ Step 6: Enable Authentication ━━━"
echo "IMPORTANT: Enable Email/Password authentication in Firebase Console:"
echo "  1. Go to https://console.firebase.google.com"
echo "  2. Select project: gen-lang-client-0586186311"
echo "  3. Click 'Build' → 'Authentication' → 'Sign-in method'"
echo "  4. Enable 'Email/Password'"
echo "  5. Also enable 'Anonymous' (needed for seed.js)"
echo "  6. Click 'Save'"
echo ""
read -p "Have you enabled Email/Password and Anonymous auth? (y/n): " AUTH_ENABLED
if [ "$AUTH_ENABLED" != "y" ]; then
    echo "Please enable authentication first, then re-run this script."
    exit 1
fi
echo ""

# Step 7: Seed the database
echo "━━━ Step 7: Seed the Database ━━━"
echo "Would you like to seed the database with sample data?"
read -p "Run seed.js? (y/n): " SEED
if [ "$SEED" = "y" ]; then
    echo "Running seed.js..."
    node seed.js
fi
echo ""

echo "======================================================"
echo "  Firebase Setup Complete!"
echo "======================================================"
echo ""
echo "Your QuoteWise app should now be fully functional."
echo "The following has been configured:"
echo "  - Firestore Database: Created and rules deployed"
echo "  - Authentication: Email/Password + Anonymous enabled"
echo "  - Sample Data: Seeded (if you chose to run seed.js)"
echo ""
echo "Next steps:"
echo "  1. Start the app: npx expo start"
echo "  2. Register a new account"
echo "  3. Start posting quotation requests!"
echo ""
