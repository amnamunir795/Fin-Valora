# Color Scheme Update Guide

## New Color Palette
- **Primary (Teal)**: #78B9B5 (replaces #B5BFC8)
- **Secondary (Dark Cyan)**: #0F828C (replaces #9FAAB5)
- **Accent (Deep Blue)**: #065084 (replaces #8A95A2)
- **Dark (Deep Purple)**: #320A6B (new color for emphasis)
- **Background**: White (unchanged)

## Files Updated:
✅ tailwind.config.js - Created with new color definitions
✅ components/LandingHeader.js - Updated logo, navigation, and buttons

## Files That Need Updating:

### Components:
- [ ] components/LandingFooter.js
- [ ] components/DashboardHeader.js
- [ ] components/FeaturesSection.js

### Pages:
- [ ] pages/index.js (Home/Landing page)
- [ ] pages/login/index.js
- [ ] pages/signup/index.js
- [ ] pages/dashboard/index.js
- [ ] pages/budget-setup/index.js

## Color Replacement Pattern:
Replace all instances of:
- `#B5BFC8` → `#78B9B5` (Primary)
- `#9FAAB5` → `#0F828C` (Secondary)
- `#8A95A2` → `#065084` (Accent)
- Add `#320A6B` for dark emphasis elements

## Common Patterns to Replace:
1. Gradients: `from-[#B5BFC8] to-[#9FAAB5]` → `from-[#78B9B5] to-[#0F828C]`
2. Hover states: `hover:from-[#9FAAB5] hover:to-[#8A95A2]` → `hover:from-[#0F828C] hover:to-[#065084]`
3. Text colors: `text-[#B5BFC8]` → `text-[#78B9B5]`
4. Background colors: `bg-[#B5BFC8]` → `bg-[#78B9B5]`
5. Border colors: `border-[#B5BFC8]` → `border-[#78B9B5]`

## Next Steps:
Run a global find and replace across all files for the old color codes.