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

// ─── Seed Data: Quotations Collection (new schema) ────────────────
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
  {
    title: "Plumbing Fixture Supply",
    clientName: "Desert Sands Hardware",
    clientEmail: "info@desertsands.na",
    currency: "NAD",
    items: [
      { description: "Industrial Faucets", quantity: 12, unitPrice: 850, total: 10200 },
      { description: "Sanitary Ware Set", quantity: 6, unitPrice: 3200, total: 19200 },
      { description: "PVC Pipe Fittings", quantity: 1, unitPrice: 4500, total: 4500 },
    ],
    subtotal: 33900,
    taxPercent: 15,
    taxAmount: 5085,
    total: 38985,
    notes: "Bulk discount applied. Free delivery within Windhoek.",
    status: "active",
    userId: "demo",
  },
  {
    title: "Office Park Wiring Installation",
    clientName: "Coastal Electrical Services",
    clientEmail: "projects@coastalelec.na",
    currency: "NAD",
    items: [
      { description: "Main Distribution Board", quantity: 1, unitPrice: 18000, total: 18000 },
      { description: "Cable Routing & Trunking", quantity: 1, unitPrice: 25000, total: 25000 },
      { description: "Light Fixture Installation", quantity: 48, unitPrice: 650, total: 31200 },
      { description: "COC Certification", quantity: 1, unitPrice: 5500, total: 5500 },
    ],
    subtotal: 79700,
    taxPercent: 15,
    taxAmount: 11955,
    total: 91655,
    notes: "Certificate of Compliance included. 6-month workmanship guarantee.",
    status: "saved",
    userId: "demo",
  },
  {
    title: "Interior & Exterior Painting",
    clientName: "Otjiwarongo Paint Centre",
    clientEmail: "",
    currency: "NAD",
    items: [
      { description: "Surface Preparation & Priming", quantity: 1, unitPrice: 4500, total: 4500 },
      { description: "Interior Painting (3 coats)", quantity: 8, unitPrice: 2800, total: 22400 },
      { description: "Exterior Painting (2 coats)", quantity: 4, unitPrice: 3500, total: 14000 },
    ],
    subtotal: 40900,
    taxPercent: 15,
    taxAmount: 6135,
    total: 47035,
    notes: "Premium Plascon paint included. 2-year weatherproof guarantee.",
    status: "draft",
    userId: "demo",
  },
];

async function seedDatabase() {
  console.log("Initializing Firestore injection...\n");
  console.log("Note: Seeding to global 'quotations' collection for demo purposes.");
  console.log("User-scoped quotations go to: users/{userId}/quotations/{quoteId}\n");
  let success = 0;
  let failed = 0;

  try {
    const quotationsRef = collection(db, "quotations");
    for (const item of quotations) {
      try {
        await addDoc(quotationsRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(`  [OK] Seeded: ${item.clientName} — ${item.title}`);
        success++;
      } catch (err) {
        console.error(`  [FAIL] ${item.clientName}: ${err.message}`);
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
      console.log(`All prices are in Namibian Dollars (NAD).`);
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
