#!/usr/bin/env node
/**
 * QuoteWise — Seed Demo Data Script
 * ══════════════════════════════════
 * Uses the Firebase JS Client SDK (same as the app).
 * Works AFTER Firestore security rules are deployed.
 *
 * HOW TO RUN:
 *   1. First deploy rules:  Go to Firebase Console → Firestore → Rules → Paste the rules → Publish
 *   2. Then run:            node seed-demo-data.js
 *
 * Demo Accounts (already created in Firebase Auth):
 *   ┌──────────────────────────────┬────────────────────┬──────────┐
 *   │ Email                        │ Password           │ Role     │
 *   ├──────────────────────────────┼────────────────────┼──────────┤
 *   │ client@quotewise.com        │ demo1234           │ Client   │
 *   │ provider@quotewise.com      │ demo1234           │ Provider │
 *   │ provider2@quotewise.com     │ demo1234           │ Provider │
 *   └──────────────────────────────┴────────────────────┴──────────┘
 */

const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} = require('firebase/auth');
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  getDocs,
  query,
  where,
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyB22yeIEm_c-qTDogIIJzRS9gDjT8CTnp8',
  authDomain: 'gen-lang-client-0586186311.firebaseapp.com',
  projectId: 'gen-lang-client-0586186311',
  storageBucket: 'gen-lang-client-0586186311.firebasestorage.app',
  messagingSenderId: '513688695839',
  appId: '1:513688695839:web:de4eff61f3b94decccd12a',
};

// ─── Demo Account Definitions ─────────────────────────────────────────────────
const ACCOUNTS = {
  client: {
    email: 'client@quotewise.com',
    password: 'demo1234',
    displayName: 'Amina Geingob',
    role: 'client',
    companyName: 'Namibia Construction CC',
    phone: '+264 81 234 5678',
    expectedUid: 'YE2fHIJteug0Dyyyi8FovaEFSAD3',
  },
  provider: {
    email: 'provider@quotewise.com',
    password: 'demo1234',
    displayName: 'Johan Pretorius',
    role: 'provider',
    companyName: 'Desert Sun Services',
    phone: '+264 81 345 6789',
    expectedUid: 'kz5pv7ChZ2RnX5jFEz7zrzEaiLD2',
  },
  provider2: {
    email: 'provider2@quotewise.com',
    password: 'demo1234',
    displayName: 'Lina Ndapanda',
    role: 'provider',
    companyName: 'Windhoek Plumbing Pros',
    phone: '+264 81 456 7890',
    expectedUid: '6uE9s0maGUQ0vPCZ7ebrvMsI0yU2',
  },
};

// ─── Helper: Sign in as a specific account ────────────────────────────────────
async function signInAs(app, account) {
  const auth = getAuth(app);
  try {
    const cred = await signInWithEmailAndPassword(auth, account.email, account.password);
    console.log(`   ✅ Signed in as ${account.displayName} (${account.email})`);
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      // Account doesn't exist yet — create it
      console.log(`   📝 Account not found, creating ${account.email}...`);
      const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
      await updateProfile(cred.user, { displayName: account.displayName });
      console.log(`   ✅ Created & signed in as ${account.displayName}`);
      return cred.user;
    }
    throw err;
  }
}

// ─── Main Seed Function ──────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          QuoteWise — Seed Demo Data                         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // ─── Step 1: Create User Profiles ────────────────────────────────────────
  console.log('📋 Step 1: Creating user profiles in Firestore...');
  const userUids = {};

  for (const [key, account] of Object.entries(ACCOUNTS)) {
    try {
      const user = await signInAs(app, account);
      userUids[key] = user.uid;

      // Write user profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: account.displayName,
        email: account.email,
        role: account.role,
        companyName: account.companyName,
        phone: account.phone,
        createdAt: serverTimestamp(),
      });
      console.log(`   ✅ Profile saved: ${account.displayName} (${account.role})`);
    } catch (err) {
      console.log(`   ❌ Failed for ${account.email}: ${err.message}`);
    }
  }

  // ─── Step 2: Client Posts Quotation Requests ─────────────────────────────
  console.log('');
  console.log('📋 Step 2: Client posting quotation requests...');

  // Sign in as client
  const clientUser = await signInAs(app, ACCOUNTS.client);
  const clientId = clientUser.uid;

  const quotes = [
    {
      clientId,
      email: ACCOUNTS.client.email,
      firstName: 'Amina',
      lastName: 'Geingob',
      phone: ACCOUNTS.client.phone,
      projectTitle: 'Office Renovation — Windhoek CBD',
      budget: 85000,
      currency: 'NAD',
      description: 'Full interior renovation of a 200sqm office space in Windhoek CBD. Includes new flooring, painting, ceiling repairs, electrical rewiring for 12 workstations, and installation of a new kitchenette. Must be completed within 6 weeks.',
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      clientId,
      email: ACCOUNTS.client.email,
      firstName: 'Amina',
      lastName: 'Geingob',
      phone: ACCOUNTS.client.phone,
      projectTitle: 'Warehouse Shelving — Walvis Bay',
      budget: 42000,
      currency: 'NAD',
      description: 'Supply and install heavy-duty industrial shelving for a 500sqm warehouse in Walvis Bay. Need 5 rows of 4-level racking, each capable of holding 500kg per shelf. Must include delivery and installation.',
      status: 'responded',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      clientId,
      email: ACCOUNTS.client.email,
      firstName: 'Amina',
      lastName: 'Geingob',
      phone: ACCOUNTS.client.phone,
      projectTitle: 'Solar Panel Installation — Swakopmund',
      budget: 120000,
      currency: 'NAD',
      description: 'Install a 10kW solar panel system on a residential property in Swakopmund. Must include panels, inverter, battery backup, and connection to the existing DB board. Compliance with Nampower regulations required.',
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      clientId,
      email: ACCOUNTS.client.email,
      firstName: 'Amina',
      lastName: 'Geingob',
      phone: ACCOUNTS.client.phone,
      projectTitle: 'Website Redesign — Namibia Construction CC',
      budget: 25000,
      currency: 'NAD',
      description: 'Complete redesign of our company website. Need a modern, mobile-responsive design with project gallery, contact form, and integration with our quotation system. Hosting setup included.',
      status: 'closed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  ];

  const quoteIds = [];
  for (const quoteData of quotes) {
    try {
      const docRef = await addDoc(collection(db, 'quotes'), quoteData);
      quoteIds.push(docRef.id);
      console.log(`   ✅ "${quoteData.projectTitle}" → id: ${docRef.id}`);
    } catch (err) {
      console.log(`   ❌ Failed: ${quoteData.projectTitle} — ${err.message}`);
      quoteIds.push(null);
    }
  }

  // ─── Step 3: Provider 1 Responds ─────────────────────────────────────────
  console.log('');
  console.log('📋 Step 3: Providers submitting quotations...');

  // Provider 1 responds to Warehouse Shelving (index 1)
  const provider1 = await signInAs(app, ACCOUNTS.provider);

  if (quoteIds[1]) {
    try {
      await addDoc(collection(db, 'quotes', quoteIds[1], 'responses'), {
        providerId: provider1.uid,
        companyName: ACCOUNTS.provider.companyName,
        price: 38500,
        currency: 'NAD',
        message: 'We can supply and install the full racking system within 3 weeks. Our shelving is rated for 600kg per shelf (exceeds your 500kg requirement). Delivery to Walvis Bay included. We have done similar installations at the Walvis Bay port.',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`   ✅ ${ACCOUNTS.provider.companyName} → Warehouse Shelving — N$38,500`);
    } catch (err) {
      console.log(`   ❌ Provider 1 response failed: ${err.message}`);
    }
  }

  // Provider 1 also responds to Office Renovation (index 0)
  if (quoteIds[0]) {
    try {
      await addDoc(collection(db, 'quotes', quoteIds[0], 'responses'), {
        providerId: provider1.uid,
        companyName: ACCOUNTS.provider.companyName,
        price: 78000,
        currency: 'NAD',
        message: 'We can handle the full renovation including electrical and plumbing. Our team has 15 years experience in commercial renovations in Windhoek. We can start within 1 week and complete in 5 weeks.',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`   ✅ ${ACCOUNTS.provider.companyName} → Office Renovation — N$78,000`);
    } catch (err) {
      console.log(`   ❌ Provider 1 response failed: ${err.message}`);
    }
  }

  // Provider 2 responds to Warehouse Shelving (index 1)
  const provider2 = await signInAs(app, ACCOUNTS.provider2);

  if (quoteIds[1]) {
    try {
      await addDoc(collection(db, 'quotes', quoteIds[1], 'responses'), {
        providerId: provider2.uid,
        companyName: ACCOUNTS.provider2.companyName,
        price: 41200,
        currency: 'NAD',
        message: 'Full supply and install of heavy-duty shelving, 5 rows as specified. Our system comes with a 5-year warranty. We can also add protective corner guards at no extra cost. Estimated timeline: 4 weeks including delivery from South Africa.',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`   ✅ ${ACCOUNTS.provider2.companyName} → Warehouse Shelving — N$41,200`);
    } catch (err) {
      console.log(`   ❌ Provider 2 response failed: ${err.message}`);
    }
  }

  // Provider 2 responds to Website Redesign (index 3)
  if (quoteIds[3]) {
    try {
      await addDoc(collection(db, 'quotes', quoteIds[3], 'responses'), {
        providerId: provider2.uid,
        companyName: ACCOUNTS.provider2.companyName,
        price: 22000,
        currency: 'NAD',
        message: 'We specialise in business websites with modern designs. Includes responsive design, SEO optimisation, contact form, and project gallery. We can deliver in 2 weeks with 3 revision rounds included.',
        status: 'accepted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`   ✅ ${ACCOUNTS.provider2.companyName} → Website Redesign — N$22,000 (accepted)`);
    } catch (err) {
      console.log(`   ❌ Provider 2 response failed: ${err.message}`);
    }
  }

  // ─── Step 4: Verify Data ─────────────────────────────────────────────────
  console.log('');
  console.log('📋 Step 4: Verifying seeded data...');

  try {
    const quotesSnap = await getDocs(collection(db, 'quotes'));
    console.log(`   ✅ Total quotes in Firestore: ${quotesSnap.size}`);

    let totalResponses = 0;
    for (const qDoc of quotesSnap.docs) {
      const resSnap = await getDocs(collection(db, 'quotes', qDoc.id, 'responses'));
      totalResponses += resSnap.size;
    }
    console.log(`   ✅ Total responses in Firestore: ${totalResponses}`);
  } catch (err) {
    console.log(`   ⚠️  Verification failed: ${err.message}`);
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                  SEED COMPLETE! 🎉                          ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║                                                              ║');
  console.log('║  Demo Accounts:                                              ║');
  console.log('║  ──────────────────────────────────────────────              ║');
  console.log('║  Client:   client@quotewise.com   / demo1234                ║');
  console.log('║  Provider: provider@quotewise.com / demo1234                ║');
  console.log('║  Provider: provider2@quotewise.com / demo1234               ║');
  console.log('║                                                              ║');
  console.log('║  Sample Data:                                                ║');
  console.log('║  • 4 quotation requests (2 open, 1 responded, 1 closed)    ║');
  console.log('║  • 4 provider responses (3 pending, 1 accepted)             ║');
  console.log('║                                                              ║');
  console.log('║  STILL NEEDED:                                               ║');
  console.log('║  • Create composite indexes in Firebase Console              ║');
  console.log('║  • Build the APK: eas build -p android                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
