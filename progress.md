# AI Project - Foreman

## Project Status
Complete static HTML/CSS/JS replica of the original React+Vite+Tailwind construction estimation app.

## Directory Structure
- `foreman/` — Original React+Vite+TypeScript + Tailwind v4 source (reference)
- `foreman2/` — Previous static attempt
- `foreman3/` — Complete faithful static replica (current working version)
- `index.html` — Early Tailwind CDN-based version
- `DESIGN.md` — Design notes
- `social image/` — Social media assets

## Foreman3 — Static HTML Replica
All 11 sections from the original React app faithfully replicated as vanilla HTML/CSS/JS:

| Section | Description |
|---------|-------------|
| Navigation | Sticky nav with logo, desktop links, mobile hamburger |
| Hero | Scanlines, bg image, glowing orbs, CTA buttons, HUD stats |
| Estimator | BlueprintTakeoff (trade switcher, markers) + EstimatorPanel (materials, labor, valuation) |
| Procurement | Supplier cards with search, filter, stock status |
| Features Bento | 3-cell bento grid with images |
| Automation | Splite before/after slider + 3-step process |
| Trade Pillars | 4 cards with gradient tops |
| Pricing | Monthly/Annual toggle, 3 tiers |
| Contact | Name/email, package select, captcha, progress logs |
| 3D Spatial Twin | Sidebar palette, 4x4 grid, BOM quote modal |
| Footer | Back-to-top, social links, legal links |

### Files
- `foreman3/index.html` — 112KB static HTML
- `foreman3/css/style.css` — 30KB utility + component CSS
- `foreman3/js/script.js` — 45KB interactive JS
- `foreman3/images/` — 3 downloaded images

### Interactive Features
- Marker placement/zoom on blueprint canvas
- Real-time estimate calculations (materials + labor + markup + tax)
- Proposal modal with copy/print
- Supplier search/filter/procurement
- 3D grid: place/select/move/delete items, auto-orbit, zoom
- Splite slider drag
- Contact form with math captcha + progress simulation
- Pricing toggle (monthly/annually)
- Mobile menu, back-to-top, legal page navigation

## Next Steps
- Edit features in `foreman3/` (backup current to git branch first)
- Create new git branches for experimental changes
- Deploy to GitHub Pages or Vercel
