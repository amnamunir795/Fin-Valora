# FinValora — Technical Specification

**Purpose:** Describe architecture, data models, API surface, and known implementation gaps as observed in the codebase.

---

## 1. System overview

```
┌─────────────┐     HTTPS      ┌──────────────────────┐     Mongoose    ┌──────────┐
│  Browser    │ ──────────────►│  Next.js (pages/api) │ ──────────────►│ MongoDB  │
│  React UI   │   JWT header   │  API Routes          │                └──────────┘
└─────────────┘                └──────────────────────┘
         │                              │
         │ localStorage                 │ optional: public/uploads/receipts
         └──────────────────────────────┘
```

- **Framework:** Next.js 16 (webpack), React 19.  
- **Database:** MongoDB via Mongoose 8; connection helper `lib/mongodb.js` (cached singleton).  
- **Auth:** `jsonwebtoken` + `bcryptjs`; token payload built in `lib/jwt.js` (`createTokenPayload`).

---

## 2. Environment variables

| Variable | Required | Usage |
|----------|----------|--------|
| `MONGODB_URI` | Yes | Mongo connection string (`lib/mongodb.js` throws if missing). |
| `JWT_SECRET` | Strongly recommended | Signing key; defaults to insecure dev string in `lib/jwt.js`. |
| `JWT_EXPIRES_IN` | Optional | Token TTL (default `7d`). |

---

## 3. Project structure (high level)

| Path | Role |
|------|------|
| `pages/` | Routes (landing, auth, dashboard, budget-setup, categories, income, feedback, about, privacy, terms) + `pages/api/*` |
| `models/` | Mongoose schemas: `User`, `Budget`, `Category`, `Transaction`, `OCRScan` |
| `middleware/auth.js` | `authenticateToken`, `optionalAuth` (Express-style `next` callback) |
| `lib/` | `mongodb.js`, `jwt.js`, `dbUtils.js`, `seedData.js` |
| `utils/auth.js` | Client: token storage, `authenticatedFetch`, login/signup/logout helpers |
| `constants/currencies.js` | `SUPPORTED_CURRENCIES`, `CURRENCY_OPTIONS`, `DEFAULT_CURRENCY` (PKR) |
| `components/` | Landing header/footer, features section, dashboard header |
| `styles/` | Global CSS |

---

## 4. Data models

### 4.1 User (`models/User.js`)

- Fields: `firstName`, `lastName`, `email` (unique), `password` (select:false, bcrypt pre-save), `currency` (enum from `SUPPORTED_CURRENCIES`), `profileImage`, `isActive`, timestamps.  
- Virtual: `fullName`.  
- `toJSON` strips `password`.

### 4.2 Budget (`models/Budget.js`)

- Fields: `userId`, `monthlyIncome`, `startDate`, `spendingLimit`, `savingGoal`, `currency`, `currentSpent`, `currentSaved`, `budgetMonth` (1–12), `budgetYear`, `isActive`.  
- Index: `{ userId, budgetYear, budgetMonth }`.  
- Virtuals: `remainingBudget`, `savingsProgress`, `spendingProgress`.  
- Static: `findCurrentBudget(userId)` — matches **current** calendar month/year and `isActive`.  
- Instance: `getSummary()`, `isOverBudget()`.

### 4.3 Category (`models/Category.js`)

- Fields: `userId`, `name`, `type` (`Income` | `Expense`), `color`, `icon`, `description`, `isActive`, `isDefault`.  
- Unique compound: `{ userId, name }` among active categories.  
- Static helpers: `findByType`, `findUserCategories`.

### 4.4 Transaction (`models/Transaction.js`)

- Fields: `userId`, `categoryId`, `budgetId`, `amount`, `description`, `merchant`, `type`, `date`, `currency`, OCR flags, `attachments`, `tags`, `notes`, `isRecurring`, `recurringPattern`.  
- Indexes: user+date, user+type+date, user+category+date, budget+type.  
- Statics: `findByDateRange`, `findByCategory`, `getMonthlySummary`, `getCategoryBreakdown`.

### 4.5 OCRScan (`models/OCRScan.js`)

- Fields: `originalFile` (filename, mimetype, size, url), `status`, `rawText`, `extractedData` (nested value/confidence), `overallConfidence`, `processingTime`, `ocrEngine`, review flags, `userCorrections`, `transactionId`, `error`.  
- Statics: `getRecentScans`, `getPendingScans`, `getScansNeedingReview`.

---

## 5. Authentication flows

### 5.1 Token issuance

- **Signup:** `POST /api/auth/signup` — creates user, may create default categories (see signup file tail), returns JWT + user.  
- **Login:** `POST /api/auth/login` — validates credentials, returns JWT + user.

### 5.2 Token consumption

- **Cookie path:** `authenticateToken(req, res, next)` reads `Authorization: Bearer` or `req.cookies.token`, verifies JWT, loads `User` from DB, sets `req.user` with `id` as `user._id`.  
- **Client:** `utils/auth.js` stores JWT in `localStorage`; `authenticatedFetch` attaches header and redirects to `/login` on 401.

### 5.3 Critical gap: `verifyToken(req)` on API routes

Several handlers import:

`import { verifyToken } from '../../../middleware/auth';`

and call:

`const authResult = await verifyToken(req);`

**`middleware/auth.js` does not export this function.** It only imports `verifyToken` from `lib/jwt.js` internally (string token verifier).  

**Affected files (non-exhaustive):**  
`pages/api/categories/index.js`, `pages/api/categories/[id].js`, `pages/api/transactions/index.js`, `pages/api/ocr/upload.js`, `pages/api/ocr/scans.js`, `pages/api/ocr/scan/[id].js`.

**Expected fix (spec):** Add an async helper, e.g. `export async function verifyRequestAuth(req)` that returns `{ success, user, message }` by parsing Bearer token, calling `jwt.verifyToken`, loading user — or refactor these routes to use `authenticateToken` with a small adapter for Next.js API routes.

---

## 6. API reference

### 6.1 Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Bearer | Logout |
| GET | `/api/auth/me` | `authenticateToken` | Current user |
| POST | `/api/auth/check-email` | No | Email availability (if implemented) |

### 6.2 Budget

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/budget/setup` | `authenticateToken` | Create/update active budget; validates income vs spending+saving |
| GET | `/api/budget/current` | `authenticateToken` | Current month active budget `getSummary()` |

### 6.3 Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | `verifyToken(req)` * | List; optional `?type=Income|Expense` |
| POST | `/api/categories` | * | Create |
| GET | `/api/categories/[id]` | * | Single category |
| PUT | `/api/categories/[id]` | * | Update |
| DELETE | `/api/categories/[id]` | * | Soft delete (`isActive: false`) |

\*Broken until `verifyToken(req)` exists — see §5.3.

### 6.4 Transactions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/transactions` | `verifyToken(req)` * | Query: `startDate`, `endDate`, `categoryId`, `type`, `limit`, `page` |
| POST | `/api/transactions` | * | Create; resolves budget by transaction date; updates `currentSpent` for Expense |

**Missing:** `PUT` / `DELETE` for `/api/transactions/[id]` — **Income page** (`pages/income/index.js`) calls these URLs; they are **not** in the repo.

### 6.5 OCR

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/ocr/upload` | `verifyToken(req)` * | Multipart upload (`formidable`), saves file, creates scan, simulates OCR |
| GET | `/api/ocr/scans` | * | List scans |
| GET | `/api/ocr/scan/[id]` | * | Scan detail (per file) |

**Dependency:** `formidable` is noted in `package-additions.json` but not declared in root `package.json` — install required for upload route.

### 6.6 Debug / misc

- `pages/api/debug/*` — test users, budget listing, auth tests (should be disabled or protected in production).  
- `pages/api/protected/profile.js` — example protected route.  
- `pages/api/hello.js` — sample.

---

## 7. Key business logic

### 7.1 Transaction create (`pages/api/transactions/index.js`)

1. Validate body: `categoryId`, `amount`, `description`, `type`, `date`.  
2. Ensure category belongs to user and `category.type === type`.  
3. Find budget: `userId`, `budgetYear`/`budgetMonth` from **transaction date**, `isActive: true`.  
4. If no budget → 400.  
5. Save transaction; if `type === 'Expense'`, add amount to `budget.currentSpent` and save budget.  
6. **Income:** comment in code notes ambiguity — `currentSaved` is **not** updated in this handler.

### 7.2 Budget setup (`pages/api/budget/setup.js`)

- Validates numeric constraints and `spendingLimit + savingGoal <= monthlyIncome`.  
- Upserts: prefers most recent active budget for updates; handles month/year conflicts by deactivating conflicting active budget.

---

## 8. Frontend routes (Pages Router)

| Route | Component | Notes |
|-------|-----------|--------|
| `/` | `pages/index.js` | Landing |
| `/login`, `/signup` | auth pages | |
| `/budget-setup` | Budget wizard | Redirects to dashboard if budget exists unless `?edit` |
| `/dashboard` | Dashboard | Requires budget; loads `/api/auth/me`, `/api/budget/current` |
| `/categories` | **Conflict risk:** `pages/categories.js` vs `pages/categories/index.js` | Next.js cannot have two files for the same URL — verify build output |
| `/income` | Income transactions UI | Uses `authenticatedFetch` + transactions API |
| `/about`, `/feedback`, `/privacy`, `/terms` | Static/marketing | |
| `/test-login` | Test page | Remove or guard in production |

---

## 9. Security notes

- JWT in `localStorage` is vulnerable to XSS; consider httpOnly cookies for production.  
- Default `JWT_SECRET` in repo is unsafe.  
- Debug endpoints should not be exposed publicly.  
- Uploaded files land under `public/uploads/receipts` — ensure path traversal is not possible (`formidable` config), scan for malware if opening to internet, and use CDN/object storage for scale.

---

## 10. Testing & verification (recommended)

- Integration tests for auth + budget + transaction create with Mongo memory server or test DB.  
- Contract tests: Income page expects `PUT/DELETE /api/transactions/:id` — add routes or change client.  
- Lint/build: `npm run build` after resolving `verifyToken` export and duplicate `categories` page.  
- Install `formidable` and run OCR upload E2E.

---

## 11. Revision history (doc)

| Version | Notes |
|---------|--------|
| 1.0 | Initial spec from repository analysis |

---

*This document is descriptive of the codebase, not a prescription for final architecture. Update when auth helpers, routes, and dependencies change.*
