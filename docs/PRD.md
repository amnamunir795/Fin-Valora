# FinValora — Product Requirements Document (PRD)

**Document type:** Product requirements derived from the current codebase and marketing UI.  
**Product:** FinValora — personal budgeting and expense tracking web app.  
**Stack (as implemented):** Next.js (Pages Router), React, MongoDB (Mongoose), JWT auth, Tailwind CSS.

---

## 1. Vision & positioning

FinValora targets individuals who want to **plan monthly budgets**, **track income and expenses by category**, and optionally **capture receipt data via upload/OCR**. The public landing page emphasizes mastering money, future planning, and a polished finance-focused brand (teal / deep green palette).

---

## 2. Target users

| Persona | Needs |
|--------|--------|
| **Budget-conscious individual** | Set monthly income, spending cap, and savings goal; see whether they are within limits. |
| **Category organizer** | Maintain Income vs Expense categories; assign transactions to categories. |
| **Receipt user** | Upload receipts (images/PDF); get extracted fields to reduce manual entry (when OCR is fully wired). |

---

## 3. Goals & success metrics (product-level)

1. **Onboarding:** User can sign up, choose currency, and complete first-month budget setup without confusion.  
2. **Core loop:** User records transactions; expense totals roll into the active monthly budget’s spent amount.  
3. **Trust:** Auth is secure enough for a personal finance MVP (hashed passwords, JWT sessions).  
4. **Clarity:** Dashboard shows income, expenses, and net balance for the current budget period.

*(Charts, AI chat, and advanced filters on the dashboard are largely placeholder UI today — see §6.)*

---

## 4. User journeys (as implemented or partially implemented)

### 4.1 Sign up → budget setup → dashboard

1. User registers with name, email, password, confirm password, and **supported regional currency** (see `constants/currencies.js`).  
2. On success, user is directed toward **budget setup** (`/budget-setup`).  
3. User enters monthly income, start date, spending limit, saving goal; system validates that **spending limit + saving goal ≤ monthly income**.  
4. Budget is stored per **calendar month/year**; user lands on **dashboard** when a current-month active budget exists.

### 4.2 Log in → dashboard

1. User logs in; JWT stored client-side (`localStorage` key `finvalora_token`).  
2. Dashboard loads user profile and **current month** budget summary via APIs.

### 4.3 Categories CRUD

1. Authenticated user lists all active categories (optionally filtered by type).  
2. User creates category (name + Income/Expense type; optional color/icon/description in API).  
3. User edits or **soft-deletes** (deactivates) a category.

### 4.4 Transactions (income / expenses)

**Intended:** Create transactions linked to user, category, and **active budget for the transaction’s month**. Expenses increase `currentSpent` on that budget.

**Partially implemented in UI:** `/income` supports listing, add, edit, and delete for **Income** transactions via authenticated API calls — **edit/delete require a per-transaction API route that is not present in the repo** (see technical spec).

### 4.5 OCR / receipts

**Intended:** Upload receipt → `OCRScan` record → processing → structured fields (amount, merchant, date, category hint, etc.).

**As implemented:** Upload stores file under `public/uploads/receipts`, creates scan with `pending` status, then **simulates** OCR with mock data (real engine integration is future work).

---

## 5. Functional requirements

### 5.1 Authentication & session

- **FR-A1:** Sign up with validation (email format, password length, password match, currency in allowlist).  
- **FR-A2:** Log in returns JWT; client stores token and sends `Authorization: Bearer <token>` on protected calls.  
- **FR-A3:** Log out clears session client-side and hits logout API.  
- **FR-A4:** `GET /api/auth/me` returns current user when token is valid.

### 5.2 User profile

- **FR-U1:** User has first name, last name, email (unique), hashed password, currency, optional profile image, active flag, timestamps.

### 5.3 Budget

- **FR-B1:** Create or update **active** budget with: monthly income, start date, spending limit, saving goal, currency.  
- **FR-B2:** Budget is scoped by **user** and **month/year** derived from start date.  
- **FR-B3:** **Current budget** API resolves the active budget for **today’s** calendar month/year.  
- **FR-B4:** Track `currentSpent` and `currentSaved` on the budget document; expose virtuals such as remaining budget and progress percentages in summaries.

### 5.4 Categories

- **FR-C1:** Categories are per user, typed as **Income** or **Expense**, with optional color, icon, description.  
- **FR-C2:** Category names are unique per user among active categories.  
- **FR-C3:** Default category seeding exists in code (`lib/seedData.js`) for new users (when invoked from signup or onboarding flow).

### 5.5 Transactions

- **FR-T1:** Transaction links `userId`, `categoryId`, `budgetId`, amount, description, type (Income/Expense), date, currency.  
- **FR-T2:** Optional fields: merchant, OCR metadata, attachments, tags, notes, recurring pattern.  
- **FR-T3:** Creating an **Expense** increments the linked budget’s `currentSpent`.  
- **FR-T4:** Category type must match transaction type.  
- **FR-T5:** No transaction without an active budget for that transaction month.

### 5.6 OCR scans

- **FR-O1:** Accept image or PDF upload up to **10MB**.  
- **FR-O2:** Persist scan metadata, status lifecycle (`pending` → `processing` → `completed` / `failed`).  
- **FR-O3:** Store extracted fields with confidence scores when processing completes.  
- **FR-O4:** List scans and fetch scan by id (APIs exist).

### 5.7 Marketing & legal (static)

- **FR-M1:** Landing page with hero, features, FAQ-style content, links to login/signup.  
- **FR-M2:** Static **Privacy** and **Terms** pages exist.

---

## 6. Dashboard & navigation (UX scope)

**Implemented:**

- Sidebar navigation (Dashboard, Categories, Income, Expenses, Reports, OCR Scanner, AI Chat, Settings — several are **non-functional placeholders**).  
- Welcome strip and **stat cards**: total income (`budget.totalIncome`), total expenses (`budget.currentSpent`), net balance.  
- Month selector and “Filter Data” dropdown **UI only** (no binding to data APIs observed).  
- OCR section on dashboard for upload/review **where wired in the page** (verify against full `dashboard/index.js`).  
- Placeholder regions for charts, category breakdown (shows N/A / zero state), and static AI chat bubbles.

**Product gap (to prioritize in backlog):**

- Wire dashboard month/filter to transaction aggregates.  
- Replace chart placeholders with real visualizations.  
- Either implement AI assistant backend or remove/mark as “coming soon.”  
- Align sidebar links (`href="#"`, `/expenses`) with real routes.

---

## 7. Non-functional requirements

| Area | Requirement |
|------|-------------|
| **Security** | Passwords hashed (bcrypt); JWT signed with configurable secret; never return password in JSON. |
| **Data** | MongoDB with indexed queries on user, budget period, transaction dates. |
| **Env** | `MONGODB_URI` required; `JWT_SECRET` / `JWT_EXPIRES_IN` recommended for production. |
| **Dependencies** | OCR upload uses `formidable` — listed in `package-additions.json` but **not** in root `package.json` until installed. |

---

## 8. Out of scope (current codebase)

- Multi-user households / shared budgets.  
- Bank sync / Plaid-style aggregation.  
- Native mobile apps.  
- Production-grade OCR (Tesseract, Google Vision, Textract, etc.) — schema and upload path exist; processing is simulated.  
- Full expenses page and reports (routes/UI partial or missing).  
- Server-side route protection middleware for pages (protection is API-centric + client redirects).

---

## 9. Open product risks

1. **Income page vs API:** Edit/delete call `/api/transactions/[id]` which is **not implemented** — breaks update/delete flows.  
2. **Duplicate `/categories` sources:** `pages/categories.js` (sample data) vs `pages/categories/index.js` (API-backed) may conflict in Next.js routing; product should have a single source of truth.  
3. **Currency display:** Dashboard labels use “Rs.” while user currency may be PKR, INR, or others — UX should use `CURRENCY_OPTIONS` symbols.  
4. **Budget “income” vs transaction income:** Expense spending updates budget; income transactions do not clearly update `currentSaved` / income totals in API — align product rules with UI expectations.

---

## 10. Release criteria (MVP checklist)

- [ ] User can sign up, log in, log out.  
- [ ] User can create/update current month budget and see dashboard stats.  
- [ ] User can manage categories via API-backed UI without duplicate route conflicts.  
- [ ] User can **create** expenses and income via API; **list** transactions with filters.  
- [ ] Transaction **update/delete** endpoints exist and match client calls.  
- [ ] OCR upload works after `formidable` (and any OCR lib) is installed; processing path documented.  
- [ ] `verifyToken(req)` helper exported from auth middleware (or routes refactored) so category/transaction/OCR APIs load.  
- [ ] Production: strong `JWT_SECRET`, HTTPS, secure cookie strategy if moving token off `localStorage`.

---

*This PRD reflects the repository state at documentation time and should be updated when features ship or scope changes.*
