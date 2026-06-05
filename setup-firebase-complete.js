#!/usr/bin/env node
/**
 * QuoteWise Firebase Complete Setup Script
 * ─────────────────────────────────────────
 * This script:
 *   1. Deploys Firestore security rules
 *   2. Creates demo user profiles in Firestore
 *   3. Seeds sample quotes and responses
 *
 * Prerequisites:
 *   - Run `firebase login` first to authenticate
 *   - Then run: node setup-firebase-complete.js
 *
 * Demo Accounts (already created in Firebase Auth):
 *   - client@quotewise.com / demo1234   (Client — Amina Geingob, Namibia Construction CC)
 *   - provider@quotewise.com / demo1234  (Provider — Johan Pretorius, Desert Sun Services)
 *   - provider2@quotewise.com / demo1234 (Provider — Lina Ndapanda, Windhoek Plumbing Pros)
 */

const { execSync } = require('child_process');
const {
  initializeApp,
  cert,
  getApps,
} = require('firebase-admin/app');
const {
  getFirestore,
  Timestamp,
  writeBatch,
  doc,
  setDoc,
  collection,
} = require('firebase-admin/firestore');

// ─── Demo Account UIDs ────────────────────────────────────────────────────────
const DEMO_USERS = {
  client: {
    uid: 'YE2fHIJteug0Dyyyi8FovaEFSAD3',
    email: 'client@quotewise.com',
    displayName: 'Amina Geingob',
    role: 'client',
    companyName: 'Namibia Construction CC',
    phone: '+264 81 234 5678',
  },
  provider: {
    uid: 'kz5pv7ChZ2RnX5jFEz7zrzEaiLD2',
    email: 'provider@quotewise.com',
    displayName: 'Johan Pretorius',
    role: 'provider',
    companyName: 'Desert Sun Services',
    phone: '+264 81 345 6789',
  },
  provider2: {
    uid: '6uE9s0maGUQ0vPCZ7ebrvMsI0yU2',
    email: 'provider2@quotewise.com',
    displayName: 'Lina Ndapanda',
    role: 'provider',
    companyName: 'Windhoek Plumbing Pros',
    phone: '+264 81 456 7890',
  },
};

// ─── Sample Quotes ────────────────────────────────────────────────────────────
const SAMPLE_QUOTES = [
  {
    clientId: DEMO_USERS.client.uid,
    email: DEMO_USERS.client.email,
    firstName: 'Amina',
    lastName: 'Geingob',
    phone: '+264 81 234 5678',
    projectTitle: 'Office Renovation — Windhoek CBD',
    budget: 85000,
    currency: 'NAD',
    description: 'Full interior renovation of a 200sqm office space in Windhoek CBD. Includes new flooring, painting, ceiling repairs, electrical rewiring for 12 workstations, and installation of a new kitchenette. Must be completed within 6 weeks.',
    status: 'open',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    clientId: DEMO_USERS.client.uid,
    email: DEMO_USERS.client.email,
    firstName: 'Amina',
    lastName: 'Geingob',
    phone: '+264 81 234 5678',
    projectTitle: 'Warehouse Shelving Installation — Walvis Bay',
    budget: 42000,
    currency: 'NAD',
    description: 'Supply and install heavy-duty industrial shelving for a 500sqm warehouse in Walvis Bay. Need 5 rows of 4-level racking, each capable of holding 500kg per shelf. Must include delivery and installation.',
    status: 'responded',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
  },
  {
    clientId: DEMO_USERS.client.uid,
    email: DEMO_USERS.client.email,
    firstName: 'Amina',
    lastName: 'Geingob',
    phone: '+264 81 234 5678',
    projectTitle: 'Solar Panel Installation — Swakopmund',
    budget: 120000,
    currency: 'NAD',
    description: 'Install a 10kW solar panel system on a residential property in Swakopmund. Must include panels, inverter, battery backup, and connection to the existing DB board. Compliance with Nampower regulations required.',
    status: 'open',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.now(),
  },
  {
    clientId: DEMO_USERS.client.uid,
    email: DEMO_USERS.client.email,
    firstName: 'Amina',
    lastName: 'Geingob',
    phone: '+264 81 234 5678',
    projectTitle: 'Website Redesign — Namibia Construction CC',
    budget: 25000,
    currency: 'NAD',
    description: 'Complete redesign of our company website. Need a modern, mobile-responsive design with project gallery, contact form, and integration with our quotation system. Hosting setup included.',
    status: 'closed',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
  },
];

// ─── Sample Responses ─────────────────────────────────────────────────────────
// These will be added to specific quotes after they're created
const SAMPLE_RESPONSES = {
  // Responses for "Warehouse Shelving" (index 1, status: responded)
  warehouse: [
    {
      providerId: DEMO_USERS.provider.uid,
      companyName: DEMO_USERS.provider.companyName,
      price: 38500,
      currency: 'NAD',
      message: 'We can supply and install the full racking system within 3 weeks. Our shelving is rated for 600kg per shelf (exceeds your 500kg requirement). Delivery to Walvis Bay included. We have done similar installations at the Walvis Bay port.',
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)),
    },
    {
      providerId: DEMO_USERS.provider2.uid,
      companyName: DEMO_USERS.provider2.companyName,
      price: 41200,
      currency: 'NAD',
      message: 'Full supply and install of heavy-duty shelving, 5 rows as specified. Our system comes with a 5-year warranty. We can also add protective corner guards at no extra cost. Estimated timeline: 4 weeks including delivery from South Africa.',
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    },
  ],
  // Responses for "Website Redesign" (index 3, status: closed)
  website: [
    {
      providerId: DEMO_USERS.provider2.uid,
      companyName: DEMO_USERS.provider2.companyName,
      price: 22000,
      currency: 'NAD',
      message: 'We specialise in business websites with modern designs. Includes responsive design, SEO optimisation, contact form, and project gallery. We can deliver in 2 weeks with 3 revision rounds included.',
      status: 'accepted',
      createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    },
  ],
};

// ─── Main Setup Function ──────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           QuoteWise Firebase Complete Setup                  ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  Project: gen-lang-client-0586186311                         ║');
  console.log('║  This will deploy rules + seed all demo data                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // ─── Step 1: Deploy Firestore Rules ───────────────────────────────────────
  console.log('📋 Step 1: Deploying Firestore security rules...');
  try {
    const result = execSync('npx firebase deploy --only firestore:rules --project gen-lang-client-0586186311', {
      cwd: __dirname,
      encoding: 'utf-8',
      timeout: 60000,
    });
    console.log('   ✅ Firestore rules deployed successfully!');
  } catch (err) {
    console.log('   ❌ Failed to deploy rules. You need to run `firebase login` first.');
    console.log('   Error:', err.message?.split('\n')[0] || 'Unknown error');
    console.log('');
    console.log('   → Run: firebase login');
    console.log('   → Then: node setup-firebase-complete.js');
    process.exit(1);
  }

  // ─── Step 2: Initialize Firebase Admin SDK ───────────────────────────────
  console.log('');
  console.log('📋 Step 2: Initializing Firebase Admin SDK...');

  if (getApps().length === 0) {
    try {
      initializeApp({ projectId: 'gen-lang-client-0586186311' });
      console.log('   ✅ Admin SDK initialized (using Application Default Credentials)');
    } catch (err) {
      console.log('   ❌ Admin SDK init failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('   ✅ Admin SDK already initialized');
  }

  const db = getFirestore();

  // ─── Step 3: Create User Profiles ────────────────────────────────────────
  console.log('');
  console.log('📋 Step 3: Creating demo user profiles in Firestore...');

  for (const [key, user] of Object.entries(DEMO_USERS)) {
    const userDoc = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      phone: user.phone,
      createdAt: Timestamp.now(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log(`   ✅ ${user.displayName} (${user.role}) — ${user.email}`);
    } catch (err) {
      console.log(`   ❌ Failed to create profile for ${user.email}:`, err.message);
    }
  }

  // ─── Step 4: Seed Sample Quotes ──────────────────────────────────────────
  console.log('');
  console.log('📋 Step 4: Seeding sample quotation requests...');

  const quoteIds = [];
  for (let i = 0; i < SAMPLE_QUOTES.length; i++) {
    const quoteData = SAMPLE_QUOTES[i];
    try {
      const docRef = await db.collection('quotes').add(quoteData);
      quoteIds.push(docRef.id);
      console.log(`   ✅ "${quoteData.projectTitle}" → ${docRef.id}`);
    } catch (err) {
      console.log(`   ❌ Failed to seed quote: ${quoteData.projectTitle}`, err.message);
      quoteIds.push(null);
    }
  }

  // ─── Step 5: Seed Sample Responses ───────────────────────────────────────
  console.log('');
  console.log('📋 Step 5: Seeding sample provider responses...');

  // Responses for Warehouse Shelving (index 1)
  if (quoteIds[1]) {
    for (const resp of SAMPLE_RESPONSES.warehouse) {
      try {
        await db.collection('quotes').doc(quoteIds[1]).collection('responses').add(resp);
        console.log(`   ✅ Response from ${resp.companyName} — N$${resp.price.toLocaleString()}`);
      } catch (err) {
        console.log(`   ❌ Failed to seed response:`, err.message);
      }
    }
  }

  // Responses for Website Redesign (index 3)
  if (quoteIds[3]) {
    for (const resp of SAMPLE_RESPONSES.website) {
      try {
        await db.collection('quotes').doc(quoteIds[3]).collection('responses').add(resp);
        console.log(`   ✅ Response from ${resp.companyName} — N$${resp.price.toLocaleString()} (${resp.status})`);
      } catch (err) {
        console.log(`   ❌ Failed to seed response:`, err.message);
      }
    }
  }

  // ─── Step 6: Create Composite Indexes ────────────────────────────────────
  console.log('');
  console.log('📋 Step 6: Creating composite indexes...');
  console.log('   ⚠️  Composite indexes must be created in the Firebase Console:');
  console.log('   → Firebase Console → Firestore → Indexes → Create Index');
  console.log('');
  console.log('   Required indexes:');
  console.log('   1. quotes: clientId ASC + updatedAt DESC');
  console.log('   2. quotes: clientId ASC + status ASC + updatedAt DESC');
  console.log('   3. quotes: status ASC + createdAt DESC');
  console.log('   4. quotes/{quoteId}/responses: createdAt DESC');
  console.log('');
  console.log('   💡 Tip: Run the app after setup. If queries fail, check Firebase');
  console.log('   Console logs — it will show direct links to create missing indexes.');

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    SETUP COMPLETE! 🎉                        ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║                                                              ║');
  console.log('║  Demo Accounts:                                              ║');
  console.log('║  ──────────────────────────────────────────────              ║');
  console.log('║  👤 Client:  client@quotewise.com   / demo1234              ║');
  console.log('║     Name: Amina Geingob — Namibia Construction CC           ║');
  console.log('║                                                              ║');
  console.log('║  👤 Provider: provider@quotewise.com / demo1234             ║');
  console.log('║     Name: Johan Pretorius — Desert Sun Services             ║');
  console.log('║                                                              ║');
  console.log('║  👤 Provider: provider2@quotewise.com / demo1234            ║');
  console.log('║     Name: Lina Ndapanda — Windhoek Plumbing Pros            ║');
  console.log('║                                                              ║');
  console.log('║  Sample Data:                                                ║');
  console.log('║  ──────────────────────────────────────────────              ║');
  console.log('║  • 4 quotation requests (1 open, 1 responded, 1 open, 1 closed) ║');
  console.log('║  • 3 provider responses (2 pending, 1 accepted)             ║');
  console.log('║                                                              ║');
  console.log('║  NEXT: Create composite indexes in Firebase Console!        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
