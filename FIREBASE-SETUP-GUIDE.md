# QuoteWise — Firebase Setup Guide

## 🔥 CRITICAL: You must do these 2 things to make the backend work

### Step 1: Deploy Firestore Security Rules

**Option A: Via Firebase Console (Easiest)**
1. Open https://console.firebase.google.com
2. Select project: **gen-lang-client-0586186311**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top
5. **Delete everything** in the editor
6. Paste the contents of `firestore.rules` file from this project
7. Click **Publish**

**Option B: Via Firebase CLI**
```bash
cd /path/to/quotewise
firebase login
firebase deploy --only firestore:rules --project gen-lang-client-0586186311
```

### Step 2: Seed Demo Data

After rules are deployed:
```bash
cd /path/to/quotewise
node seed-demo-data.js
```

This creates:
- 3 user profiles in Firestore
- 4 sample quotation requests
- 4 provider responses

---
## 📱 Demo Accounts

| Role     | Email                    | Password | Name              | Company                  |
|----------|--------------------------|----------|-------------------|--------------------------|
| Client   | client@quotewise.com     | demo1234 | Amina Geingob     | Namibia Construction CC  |
| Provider | provider@quotewise.com   | demo1234 | Johan Pretorius   | Desert Sun Services      |
| Provider | provider2@quotewise.com  | demo1234 | Lina Ndapanda     | Windhoek Plumbing Pros   |


---

## 🗂️ Firestore Structure

```
users/{uid}
  ├── displayName, email, role, companyName, phone, createdAt
  └── quotations/{quoteId}  (legacy)
        ├── title, clientName, items[], subtotal, total, status, etc.

quotes/{quoteId}
  ├── clientId, projectTitle, budget, description, status, etc.
  └── responses/{responseId}
        ├── providerId, companyName, price, message, status, etc.
```

---

## 📊 Required Composite Indexes

After deploying rules, create these indexes in Firebase Console → Firestore → Indexes:

1. **quotes**: `clientId` ASC + `updatedAt` DESC
2. **quotes**: `clientId` ASC + `status` ASC + `updatedAt` DESC
3. **quotes**: `status` ASC + `createdAt` DESC
4. **quotes/{quoteId}/responses**: `createdAt` DESC

**Shortcut**: Just run the app. When queries fail, Firebase logs will show direct links to create the missing indexes automatically.

---

## ✅ Verification Checklist

- [ ] Firestore rules deployed (Firebase Console → Firestore → Rules)
- [ ] Demo data seeded (`node seed-demo-data.js`)
- [ ] Composite indexes created (or auto-created via error links)
- [ ] App can log in with demo accounts
- [ ] Client can compose a quotation request
- [ ] Provider can submit a quotation response
- [ ] Client can accept/reject responses
