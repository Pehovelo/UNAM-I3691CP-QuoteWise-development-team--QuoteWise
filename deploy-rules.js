// deploy-rules.js — Deploy Firestore rules using Firebase REST API
// This script reads firestore.rules and deploys them to your Firebase project.
//
// IMPORTANT: This requires the Firebase CLI to be authenticated.
// Run `firebase login` first, then run this script.
//
// Usage: node deploy-rules.js

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const PROJECT_ID = 'gen-lang-client-0586186311';
const RULES_FILE = './firestore.rules';

async function deployRules() {
  console.log('========================================');
  console.log('  QuoteWise — Deploy Firestore Rules');
  console.log('========================================\n');

  // Read the rules file
  let rulesContent;
  try {
    rulesContent = readFileSync(RULES_FILE, 'utf8');
    console.log(`Read ${rulesContent.split('\n').length} lines from ${RULES_FILE}`);
  } catch (err) {
    console.error(`Failed to read ${RULES_FILE}:`, err.message);
    process.exit(1);
  }

  // Try deploying with Firebase CLI
  console.log('\nAttempting to deploy with Firebase CLI...');
  try {
    const result = execSync('firebase deploy --only firestore:rules --project ' + PROJECT_ID, {
      encoding: 'utf8',
      timeout: 60000,
      stdio: 'pipe',
    });
    console.log(result);
    console.log('\nFirestore rules deployed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Firebase CLI deploy failed:', err.message);
    console.log('\n' + '='.repeat(60));
    console.log('MANUAL DEPLOYMENT REQUIRED');
    console.log('='.repeat(60));
    console.log('\nPlease follow these steps:');
    console.log('1. Go to: https://console.firebase.google.com');
    console.log(`2. Select project: ${PROJECT_ID}`);
    console.log('3. Click: Build → Firestore Database → Rules tab');
    console.log('4. Replace the existing rules with:');
    console.log('');
    console.log(rulesContent);
    console.log('');
    console.log('5. Click "Publish"');
    console.log('');
    console.log('Alternatively, run these commands in your terminal:');
    console.log('  npm install -g firebase-tools');
    console.log('  firebase login');
    console.log(`  firebase use ${PROJECT_ID}`);
    console.log('  firebase deploy --only firestore:rules');
    process.exit(1);
  }
}

deployRules();
