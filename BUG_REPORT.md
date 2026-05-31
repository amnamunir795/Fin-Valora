# FinValora — Comprehensive Bug & UI Audit Report
**Date:** May 31, 2026  
**Auditor:** Hermes Agent (code audit + visual browser testing)  
**Project:** H:\Fin-Valora-master  

---

## EXECUTIVE SUMMARY

**Total issues found: 42**  
- CRITICAL: 5  
- HIGH: 10  
- MEDIUM: 18  
- LOW: 9  

The app is mid-MVP. Core auth and budget flows work. The biggest themes are:
1. **USD fallback everywhere** — app only supports Asian currencies but defaults to USD
2. **Missing page titles** — every page except /terms has an empty `<title>`
3. **Security exposure** — 6 debug endpoints are unauthenticated
4. **Landing page visual bugs** — empty feature headings, missing spaces
5. **Dead code** — 7+ unused modules/exports
6. **Inconsistent auth patterns** — some routes use Express-style middleware, others use async helper

---

## TASK LIST (ordered by priority)

### PHASE 1: Critical Fixes (blocks functionality or causes data corruption)

| # | Severity | File(s) | Issue | Fix |
|---|----------|---------|-------|-----|
| 1 | CRITICAL | `constants/currencies.js` | `SUPPORTED_CURRENCIES` does not include `USD` but models/defaults fallback to USD everywhere | Add `USD` to supported list OR change all fallbacks to `DEFAULT_CURRENCY` ('PKR') |
| 2 | CRITICAL | `models/Budget.js:33` | Budget schema defaults `currency` to `"USD"` — not in supported list | Change default to `DEFAULT_CURRENCY` from constants |
| 3 | CRITICAL | `models/Transaction.js:53` | Transaction schema defaults `currency` to `"USD"` | Change default to `DEFAULT_CURRENCY` |
| 4 | CRITICAL | `pages/api/debug/user-info.js` | Unauthenticated endpoint exposes user data + password hash length | Add authentication or delete file |
| 5 | CRITICAL | `pages/api/debug/test-login.js` | Unauthenticated GET lists ALL users | Add authentication or delete file |

### PHASE 2: High Priority (broken features or security gaps)

| # | Severity | File(s) | Issue | Fix |
|---|----------|---------|-------|-----|
| 6 | HIGH | `pages/api/budget/setup.js:97,117` | Currency falls back to `"USD"` instead of user's currency | Use `req.user.currency` as fallback |
| 7 | HIGH | `pages/budget-setup/index.js:17` | Default form state uses `currency: "USD"` | Use `DEFAULT_CURRENCY` |
| 8 | HIGH | `pages/api/debug/test-auth.js:17-18` | Exposes raw Authorization/Cookie headers in response | Remove header echoing |
| 9 | HIGH | `pages/test-login.js` | Debug page with hardcoded credentials accessible in production | Delete or protect with env flag |
| 10 | HIGH | `pages/api/budget/current.js:16-38` | Promise double-resolution risk on authenticateToken wrapper | Refactor to use `verifyRequestAuth` |
| 11 | HIGH | `pages/index.js:207` | Hardcoded "$12,450" mock data in hero section | Use dynamic or placeholder-free design |
| 12 | HIGH | `components/FeaturesSection.js` | Feature card headings render as EMPTY text | Fix heading text content |
| 13 | HIGH | `pages/index.js` (hero) | "Master YourMoney" — missing space | Add space: "Your Money" |
| 14 | HIGH | `pages/signup/index.js` | Checkbox label: "theTerms and ConditionsandPrivacy Policy" — missing spaces | Fix spacing |
| 15 | HIGH | `pages/settings/index.js` | No auth redirect — accessible without login | Add auth check like other protected pages |

### PHASE 3: Medium Priority (UX issues, dead code, inconsistencies)

| # | Severity | File(s) | Issue | Fix |
|---|----------|---------|-------|-----|
| 16 | MEDIUM | ALL pages except /terms | Empty `<title>` tags | Add proper titles to every page |
| 17 | MEDIUM | `lib/jwt.js:3` | Hardcoded fallback JWT secret | Throw error if env var missing |
| 18 | MEDIUM | `pages/api/auth/login.js:76`, `signup.js:120` | Auth cookie missing `Secure` flag | Add `Secure` flag for production |
| 19 | MEDIUM | `utils/formatMoney.js:7,24` | Falls back to USD locale | Use DEFAULT_CURRENCY |
| 20 | MEDIUM | `pages/dashboard/index.js:47` + 3 others | `getCurrencySymbol` falls back to "$" | Fall back to default currency symbol |
| 21 | MEDIUM | `pages/api/ocr/scan/[id]/apply-expense.js:113` | Fallback currency 'USD' | Use DEFAULT_CURRENCY |
| 22 | MEDIUM | `components/DashboardHeader.js` | Unused component (never imported) | Remove or integrate |
| 23 | MEDIUM | `utils/budgetAuth.js` | Unused utility (never imported) | Remove |
| 24 | MEDIUM | `utils/debugAuth.js` | Unused utility (never imported) | Remove |
| 25 | MEDIUM | `lib/dbUtils.js` | Unused utility (never imported) | Remove |
| 26 | MEDIUM | `utils/currency.js:60-63` | `getCurrencyName` never imported | Remove |
| 27 | MEDIUM | `lib/seedData.js:65-117` | `suggestCategory` + `initializeSampleData` never imported | Remove unused exports |
| 28 | MEDIUM | `lib/jwt.js:28` | `decodeToken` never imported | Remove |
| 29 | MEDIUM | `middleware/auth.js:101-128` | `optionalAuth` never imported | Remove |
| 30 | MEDIUM | `pages/income/index.js:1` | UTF-8 BOM character at start of file | Remove BOM |
| 31 | MEDIUM | `pages/about/index.js` | Stub page — only 1 sentence of content | Add real content or mark "coming soon" |
| 32 | MEDIUM | `pages/index.js` (OCR card) | Hardcoded receipt data "Date: 15/03/2023, Amount: $1,323.00" | Use generic placeholder or dynamic data |
| 33 | MEDIUM | `pages/signup/index.js` | Currency defaults to Pakistan (₨) — no "Select Currency" placeholder | Add placeholder option |

### PHASE 4: Low Priority (cleanup, polish)

| # | Severity | File(s) | Issue | Fix |
|---|----------|---------|-------|-----|
| 34 | LOW | `pages/api/auth/me.js:13-31` | Express-style authenticateToken wrapped in Promise — dangling on auth failure | Refactor to verifyRequestAuth |
| 35 | LOW | `pages/api/debug/budget-status.js`, `list-budgets.js` | 90% duplicate code | Consolidate |
| 36 | LOW | `pages/feedback/index.js:24-47` | Direct DOM manipulation for confetti (not React pattern) | Use React ref or library |
| 37 | LOW | `pages/index.js:77` | `useRouter()` in useEffect deps causes re-fires | Use specific query property |
| 38 | LOW | Multiple API routes | Inconsistent auth: 7 use authenticateToken wrapper, 9 use verifyRequestAuth | Standardize on verifyRequestAuth |
| 39 | LOW | `package-additions.json` | formidable was missing from package.json (FIXED during audit) | Already installed |
| 40 | LOW | `eng.traineddata` | 35MB Tesseract model committed to git | Add to .gitignore |
| 41 | LOW | Global | scroll-behavior: smooth on <html> triggers Next.js warning | Use data-scroll-behavior attribute |
| 42 | LOW | Footer links | Dead placeholder links (Pricing, Blog, Guides, etc.) | Remove or mark coming soon |

---

## VISUAL TEST RESULTS (per page)

| Page | Loads | Auth Guard | Visual Issues |
|------|-------|-----------|---------------|
| `/` (landing) | OK | N/A | Empty feature headings, "YourMoney" typo, hardcoded $12,450, OCR card mock data |
| `/login` | OK | N/A | Empty title only |
| `/signup` | OK | N/A | Missing spaces in checkbox label, currency default |
| `/about` | OK | N/A | Stub page, empty title |
| `/feedback` | OK | N/A | Empty title only |
| `/privacy` | OK | N/A | Empty title only |
| `/terms` | OK | N/A | None — cleanest page |
| `/dashboard` | Redirect | OK | Cannot test without auth |
| `/budget-setup` | Redirect | OK | Cannot test without auth |
| `/categories` | Redirect | OK | Cannot test without auth |
| `/income` | Redirect | OK | Cannot test without auth |
| `/expenses` | Redirect | OK | Cannot test without auth |
| `/reports` | Redirect | OK | Cannot test without auth |
| `/ai-chat` | Redirect | OK | Cannot test without auth |
| `/settings` | OK | **MISSING** | Accessible without login, placeholder content |
| `/ocr-scanner` | Redirect | OK | Cannot test without auth |

---

## FILE INVENTORY

- **96 files** total
- **5 models:** User, Budget, Category, Transaction, OCRScan
- **26 API routes** under pages/api/
- **16 pages** (landing, auth, dashboard, features, legal)
- **6 components** (sidebar, headers, footer, logo, features)
- **5 docs** (PRD, SPEC, DESIGN_SYSTEM, OCR_SPEC, AI_CHAT_SPEC)
- **6 utils** (auth, currency, formatMoney, budgetAuth, debugAuth, reportPdf)
- **6 lib modules** (mongodb, jwt, dbUtils, seedData, receiptOcr, ai/tools)

---

*Report generated by automated code audit + browser testing.*
