// seed.js — QuoteWise Firestore Database Seeder
// Run: node seed.js
// Prerequisites: Firebase Firestore database must be created in Test Mode first
// (Firebase Console → Build → Firestore Database → Create Database → Test Mode)

import { initializeApp } from "firebase/app";
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
const db = getFirestore(app);

// ─── Seed Data: Quotations Collection ─────────────────────────────
const quotations = [
  {
    supplier: "Acme Industrial Corp",
    project: "Commercial Office Renovation",
    amount: "N$ 154,500",
    status: "Pending",
    date: "2026-06-02",
  },
  {
    supplier: "Apex Logistics & Supply",
    project: "Warehouse Material Procurement",
    amount: "N$ 89,000",
    status: "Approved",
    date: "2026-05-28",
  },
  {
    supplier: "Vertex Builders",
    project: "Site Structural Framing",
    amount: "N$ 240,000",
    status: "Pending",
    date: "2026-05-15",
  },
  {
    supplier: "Desert Sands Hardware",
    project: "Plumbing Fixture Supply",
    amount: "N$ 42,800",
    status: "Draft",
    date: "2026-06-01",
  },
  {
    supplier: "Namib Steel Traders",
    project: "Reinforcement Steel Delivery",
    amount: "N$ 178,200",
    status: "Pending",
    date: "2026-05-30",
  },
  {
    supplier: "Coastal Electrical Services",
    project: "Office Park Wiring Installation",
    amount: "N$ 95,600",
    status: "Approved",
    date: "2026-05-22",
  },
  {
    supplier: "Kalahari Concrete Mix",
    project: "Foundation Concrete Supply",
    amount: "N$ 67,300",
    status: "Draft",
    date: "2026-06-03",
  },
  {
    supplier: "Windhoek Roofing Solutions",
    project: "Industrial Roof Replacement",
    amount: "N$ 312,000",
    status: "Pending",
    date: "2026-05-18",
  },
  {
    supplier: "Otjiwarongo Paint Centre",
    project: "Interior & Exterior Painting",
    amount: "N$ 28,500",
    status: "Approved",
    date: "2026-05-25",
  },
  {
    supplier: "Swakopmund Glass & Aluminium",
    project: "Curtain Wall Installation",
    amount: "N$ 445,000",
    status: "Pending",
    date: "2026-05-12",
  },
  {
    supplier: "Northern Timber Suppliers",
    project: "Hardwood Flooring for Lobby",
    amount: "N$ 56,700",
    status: "Draft",
    date: "2026-06-02",
  },
  {
    supplier: "Caprivi Landscaping Co.",
    project: "Corporate Garden & Irrigation",
    amount: "N$ 34,200",
    status: "Approved",
    date: "2026-05-20",
  },
];

async function seedDatabase() {
  console.log("Initializing Firestore injection...\n");
  let success = 0;
  let failed = 0;

  try {
    const quotationsRef = collection(db, "quotations");
    for (const item of quotations) {
      try {
        await addDoc(quotationsRef, {
          ...item,
          createdAt: serverTimestamp(),
        });
        console.log(`  [OK] Seeded: ${item.supplier} — ${item.project}`);
        success++;
      } catch (err) {
        console.error(`  [FAIL] ${item.supplier}: ${err.message}`);
        failed++;
      }
    }

    console.log(`\n----------------------------------------------`);
    console.log(`Database seeding complete!`);
    console.log(`  Success: ${success}`);
    console.log(`  Failed:  ${failed}`);
    console.log(`  Total:   ${quotations.length}`);
    console.log(`----------------------------------------------\n`);

    if (failed === 0) {
      console.log(`Your app will now display live quotation cards.`);
      console.log(`You can safely delete seed.js after confirming the data.`);
    } else {
      console.log(`Some entries failed. Make sure Firestore is in Test Mode.`);
      console.log(`Firebase Console > Build > Firestore Database > Rules`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Fatal seeding error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
