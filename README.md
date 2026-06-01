# QuoteWise — Smart Budgeting & Quotation for Construction

> **Engineering Domain:** Civil Engineering — Construction Budgeting, Quotation Management & Project Cost Tracking

## 📱 App Description

**QuoteWise** is a cross-platform Android/iOS mobile application built with **Expo (React Native)** designed for the construction industry. It empowers contractors, project managers, and civil engineering teams to:

- **Create & manage quotations** from suppliers and subcontractors
- **Track project budgets** in real time with cost breakdowns
- **Store and retrieve estimates** securely via Firebase
- **Review, accept, or reject** quotations with full audit trails
- **Draft and save** estimates for later comparison and approval

The app provides a clean, professional interface optimized for on-site use, enabling construction professionals to make informed financial decisions from anywhere.

---

## 👥 Team Roster

| # | Name | Student Number | Role |
|---|------|---------------|------|
| 1 | Immanuel Oliveira | 225109611 | Project Manager |
| 2 | Nailoke Nghiiteka | 224048007 | Project Manager Assistant |
| 3 | Lasarus Shiyelekeni | 224030698 | Lead Developer |
| 4 | Wilhelm WS Moses | 224096389 | Lead Developer Assistant |
| 5 | Benhard Handura | 225153238 | Firebase Lead |
| 6 | Erikson Shapwa | 222068841 | Firebase Assistant |
| 7 | Veikko Shikage | 225066866 | UI/UX Lead |
| 8 | Kandjimwena Dison | 225072572 | UI/UX Assistant |
| 9 | Lavmo Shiweda | 225051532 | Documentation Lead |
| 10 | Kambonde Lehabeam | 225095211 | Documentation Assistant |
| 11 | Pehovelo Halwoodi | 225050390 | GitHub Manager |
| 12 | Michael Kautuara | 224103806 | GitHub Assistant |

---

## 🏗️ Engineering Domain

This project falls under **Civil Engineering** with a focus on:

- **Construction Cost Estimation** — Material, labor, and equipment cost tracking
- **Quotation Management** — Supplier bid comparison and approval workflows
- **Project Budgeting** — Real-time budget monitoring against actual spend
- **Document Management** — Secure storage of PDFs, contracts, and estimates
- **Mobile-First Field Operations** — On-site access to financial data for project managers and site engineers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Expo SDK ~55.0.25 |
| **UI Runtime** | React Native 0.83.6 |
| **UI Library** | React 19.2.0 |
| **Navigation** | React Navigation (Native Stack) |
| **Lists** | @shopify/flash-list |
| **Images** | expo-image |
| **Icons** | @expo/vector-icons (MaterialIcons) |
| **Gradients** | expo-linear-gradient |
| **Backend (planned)** | Firebase (Auth, Firestore, Storage) |
| **Language** | JavaScript |
| **Platform** | Android & iOS |

---

## 📂 Project Structure

```
QuoteWise/
├── App.js                              # Root component (entry point)
├── app.json                            # Expo app configuration
├── package.json                        # Dependencies and scripts
├── index.js                            # Expo root component registration
├── BUILD_PLAN.md                       # Rebuild plan & audit findings
├── README.md                           # This file
├── docs/
│   ├── mockups/                        # HTML design references (from v0.dev)
│   └── screenshots/                    # PNG design screenshots
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js             # React Navigation Native Stack
│   ├── screens/
│   │   ├── WelcomeLoginScreen.js       # Welcome / authentication screen
│   │   ├── DashboardScreen.js          # Main dashboard with nav cards
│   │   ├── QuotationsScreen.js         # Active quotations list (FlashList)
│   │   ├── QuotationDetailScreen.js    # Detail view with Accept/Reject/Save
│   │   ├── DraftScreen.js              # Draft quotation management
│   │   └── SavedQuotationsScreen.js    # Saved/archived quotations
│   ├── components/
│   │   ├── Header.js                   # Reusable top app bar
│   │   ├── QuotationCard.js            # Quotation list item card
│   │   ├── LoadingState.js             # Centered loading indicator
│   │   └── EmptyState.js               # Centered empty state message
│   ├── context/
│   │   └── QuotationContext.js          # Global quotation state (useReducer)
│   ├── services/
│   │   ├── firebase.js                 # Firebase config (placeholder)
│   │   ├── quotationService.js         # Quotation CRUD service layer
│   │   └── mockData.js                 # Mock quotation data
│   ├── theme/
│   │   ├── colors.js                   # MD3 color tokens (light + dark)
│   │   ├── spacing.js                  # Spacing & border radius tokens
│   │   ├── typography.js               # Font size & weight tokens
│   │   └── index.js                    # Unified theme export
│   ├── hooks/                          # Custom hooks (future)
│   └── utils/                          # Utility functions (future)
└── assets/                             # App icons, splash images
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn)
- **Expo CLI** — installed automatically via `npx`
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd QuoteWise

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on a Device

- **Android Emulator:** Press `a` in the Expo dev server terminal
- **iOS Simulator:** Press `i` in the Expo dev server terminal
- **Physical Device:** Scan the QR code with the **Expo Go** app (Android) or **Camera** app (iOS)

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Welcome / Login** | Entry point with authentication flow |
| **Dashboard** | Central hub with cards for Quotations, Saved Quotations, Drafts, and Settings |
| **Quotations** | List of active/pending quotations with status tags (Draft, Pending Review) |
| **Saved Quotations** | Archive of securely stored estimates |
| **Drafts** | Work-in-progress quotations |
| **Quotation Detail** | Full quotation view with project title, budget, description, PDF download, and Accept/Reject/Save actions |

---

## 📄 Reference Documents

The following documents provide detailed project specifications, engineering guidelines, and development blueprints:

| Document | Description |
|----------|-------------|
| [QuoteWise Mobile App Development](./QuoteWise_Mobile_App_Development3ff4.pdf) | Core app development specifications and requirements |
| [Engineering Mobile App Playbook](./Engineering_Mobile_App_Playbook.pdf) | Engineering best practices and mobile development guidelines |
| [QuoteWise Project Blueprint](./QuoteWise_Project_Blueprint.pdf) | Project architecture, milestones, and delivery plan |

---

## 📋 Development Workflow

1. **Branch per feature** — Create a new branch for each screen or feature
2. **Commit often** — Use descriptive commit messages
3. **Test on device** — Verify UI on both Android and iOS before merging
4. **Code review** — All PRs reviewed by Lead Developer and GitHub Manager
5. **Firebase integration** — Coordinate with Firebase Lead for backend connectivity

---

## 🔮 Roadmap

- [x] Expo project initialized and configured
- [x] React Navigation Native Stack with all 6 screens
- [x] Dashboard with navigation cards and live quotation counts
- [x] Quotation list screen with FlashList
- [x] Quotation detail with Accept/Reject/Save actions
- [x] Draft management screen
- [x] Saved quotations archive screen
- [x] Material Design 3 theme system (light + dark tokens)
- [x] QuotationContext for global state management
- [x] Firebase service layer (placeholder with env variables)
- [x] Accessibility labels on all interactive elements
- [x] Loading and empty states on all list screens
- [ ] Firebase Authentication (email/password, Google sign-in)
- [ ] Firestore integration for quotation storage and retrieval
- [ ] Firebase Storage for PDF uploads and downloads
- [ ] Real-time budget tracking dashboard
- [ ] Push notifications for quotation status changes
- [ ] Offline mode with local caching
- [ ] Multi-currency support
- [ ] Export quotations to PDF with company branding
- [ ] Dark mode toggle
- [ ] Custom font loading (Newsreader + Geist via @expo-google-fonts)

---

## 📞 Contact

For questions or contributions, reach out to the project team via the repository issues or contact **Immanuel Oliveira** (Project Manager).
