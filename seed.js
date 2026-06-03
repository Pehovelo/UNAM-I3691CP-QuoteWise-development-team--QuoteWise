// seed.js — QuoteWise Firestore Database Seeder
// Run: node seed.js
// Prerequisites:
//   1. Firebase Firestore must be created (Firebase Console → Build → Firestore Database → Create Database)
//   2. Firestore rules must allow authenticated writes (deploy firestore.rules)
//   3. You must be logged in: firebase login

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase Configuration — same as src/services/firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyB22yeIEm_c-qTDogIIJzRS9gDjT8CTnp8",
  authDomain: "gen-lang-client-0586186311.firebaseapp.com",
  projectId: "gen-lang-client-0586186311",
  storageBucket: "gen-lang-client-0586186311.firebasestorage.app",
  messagingSenderId: "513688695839",
  appId: "1:513688695839:web:de4eff61f3b94decccd12a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─── Seed Data: Quotes Collection (marketplace) ─────────────────────
const quotes = [
  {
    projectTitle: "Office Renovation in Windhoek CBD",
    clientId: "seed_client_1",
    email: "procurement@acmeindustrial.na",
    firstName: "Johan",
    lastName: "van Wyk",
    phone: "+264 61 234 567",
    budget: 79925,
    currency: "NAD",
    description: "Full commercial office renovation including structural assessment, partitioning, electrical rewiring, and flooring installation for a 500sqm office space in Windhoek CBD.",
    status: "open",
  },
  {
    projectTitle: "Warehouse Shelving & Equipment",
    clientId: "seed_client_2",
    email: "orders@apexlogistics.na",
    firstName: "Maria",
    lastName: "Shikongo",
    phone: "+264 61 345 678",
    budget: 98670,
    currency: "NAD",
    description: "Procurement and installation of heavy-duty warehouse shelving units, loading bay equipment, and safety barriers. Delivery and installation included.",
    status: "open",
  },
  {
    projectTitle: "Structural Steel Framing",
    clientId: "seed_client_3",
    email: "",
    firstName: "Pieter",
    lastName: "Botha",
    phone: "+264 61 456 789",
    budget: 239200,
    currency: "NAD",
    description: "Steel frame fabrication, on-site assembly and welding, plus quality inspection and certification for a new industrial building. Must comply with SANS standards.",
    status: "open",
  },
  {
    projectTitle: "Plumbing Fixtures Supply — Bulk Order",
    clientId: "seed_client_4",
    email: "info@desertsands.na",
    firstName: "Aina",
    lastName: "Nambinga",
    phone: "+264 64 567 890",
    budget: 38985,
    currency: "NAD",
    description: "Bulk supply of industrial faucets, sanitary ware sets, and PVC pipe fittings for a residential development project in Swakopmund. Free delivery within Windhoek.",
    status: "responded",
  },
  {
    projectTitle: "Office Park Electrical Installation",
    clientId: "seed_client_5",
    email: "projects@coastalelec.na",
    firstName: "David",
    lastName: "Amukongo",
    phone: "+264 61 678 901",
    budget: 91655,
    currency: "NAD",
    description: "Main distribution board installation, cable routing and trunking, light fixture installation (48 units), and COC certification for an office park in Kleine Kuppe.",
    status: "responded",
  },
  {
    projectTitle: "Interior & Exterior Painting",
    clientId: "seed_client_6",
    email: "",
    firstName: "Helena",
    lastName: "Tjiveze",
    phone: "+264 67 789 012",
    budget: 47035,
    currency: "NAD",
    description: "Surface preparation, priming, interior painting (3 coats), and exterior painting (2 coats) for a guesthouse in Otjiwarongo. Premium Plascon paint included.",
    status: "closed",
  },
];

// ─── Seed Data: Legacy Quotations Collection ─────────────────────────
const quotations = [
  {
    title: "Commercial Office Renovation",
    clientName: "Acme Industrial Corp",
    clientEmail: "procurement@acmeindustrial.na",
    currency: "NAD",
    items: [
      { description: "Structural Assessment & Design", quantity: 1, unitPrice: 12000, total: 12000 },
      { description: "Interior Partitioning", quantity: 5, unitPrice: 4500, total: 22500 },
      { description: "Electrical Rewiring", quantity: 1, unitPrice: 18000, total: 18000 },
      { description: "Flooring Installation", quantity: 200, unitPrice: 85, total: 17000 },
    ],
    subtotal: 69500,
    taxPercent: 15,
    taxAmount: 10425,
    total: 79925,
    notes: "Payment: 40% deposit, 60% on completion. Valid for 30 days.",
    status: "active",
    userId: "demo",
  },
  {
    title: "Warehouse Material Procurement",
    clientName: "Apex Logistics & Supply",
    clientEmail: "orders@apexlogistics.na",
    currency: "NAD",
    items: [
      { description: "Steel Shelving Units", quantity: 20, unitPrice: 2800, total: 56000 },
      { description: "Loading Bay Equipment", quantity: 2, unitPrice: 8500, total: 17000 },
      { description: "Safety Barrier Installation", quantity: 4, unitPrice: 3200, total: 12800 },
    ],
    subtotal: 85800,
    taxPercent: 15,
    taxAmount: 12870,
    total: 98670,
    notes: "Delivery within 14 business days. Installation included.",
    status: "saved",
    userId: "demo",
  },
  {
    title: "Site Structural Framing",
    clientName: "Vertex Builders",
    clientEmail: "",
    currency: "NAD",
    items: [
      { description: "Steel Frame Fabrication", quantity: 1, unitPrice: 145000, total: 145000 },
      { description: "On-site Assembly & Welding", quantity: 1, unitPrice: 55000, total: 55000 },
      { description: "Quality Inspection & Certification", quantity: 1, unitPrice: 8000, total: 8000 },
    ],
    subtotal: 208000,
    taxPercent: 15,
    taxAmount: 31200,
    total: 239200,
    notes: "All work complies with SANS standards. 12-month structural warranty included.",
    status: "draft",
    userId: "demo",
  },
];

async function seedDatabase() {
  console.log("===========================================");
  console.log("  QuoteWise Firestore Database Seeder");
  console.log("===========================================\n");

  // Sign in anonymously to get auth credentials for Firestore rules
  console.log("Signing in anonymously...");
  try {
    await signInAnonymously(auth);
    console.log("Authenticated successfully.\n");
  } catch (authErr) {
    console.error("Anonymous auth failed:", authErr.message);
    console.log("Note: If anonymous auth is disabled, you'll need to enable it in Firebase Console.");
    console.log("  Firebase Console → Authentication → Sign-in method → Anonymous → Enable\n");
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  // Seed the NEW quotes collection (marketplace)
  console.log("Seeding 'quotes' collection (marketplace)...\n");
  for (const item of quotes) {
    try {
      await addDoc(collection(db, "quotes"), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  [OK] ${item.projectTitle}`);
      success++;
    } catch (err) {
      console.error(`  [FAIL] ${item.projectTitle}: ${err.code || ''} ${err.message}`);
      failed++;
    }
  }

  // Seed the LEGACY quotations collection
  console.log("\nSeeding 'quotations' collection (legacy)...\n");
  for (const item of quotations) {
    try {
      await addDoc(collection(db, "quotations"), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  [OK] ${item.clientName} — ${item.title}`);
      success++;
    } catch (err) {
      console.error(`  [FAIL] ${item.clientName}: ${err.code || ''} ${err.message}`);
      failed++;
    }
  }

  console.log(`\n----------------------------------------------`);
  console.log(`Database seeding complete!`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total:   ${quotes.length + quotations.length}`);
  console.log(`----------------------------------------------\n`);

  if (failed > 0) {
    console.log(`Some entries failed. This usually means:`);
    console.log(`  1. Firestore is not created yet (Firebase Console → Build → Firestore Database → Create)`);
    console.log(`  2. Firestore rules deny access (deploy firestore.rules: firebase deploy --only firestore:rules)`);
    console.log(`  3. Anonymous auth is disabled (Firebase Console → Authentication → Sign-in method → Enable Anonymous)`);
  } else {
    console.log(`Your app will now display live quotation cards.`);
    console.log(`All prices are in Namibian Dollars (NAD).`);
  }

  process.exit(0);
}

seedDatabase();
