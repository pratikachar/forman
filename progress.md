# AI Project - Foreman

## Current Branch
- `edits` branch — active development in `foreman4/`
- `master` branch — `foreman3/` backup (original static replica)

## Foreman4 — WordPress Theme Conversion

### Theme Location
`foreman4/foreman-ai-theme/` — full WP theme ready for upload.

### Round 1 — Static HTML → Theme Conversion
- Tailwind arbitrary-value classes (~150) added to `style.css`
- Images folder created with hero-bg.jpg, blueprint-bento.jpg, trade-linkages.jpg
- Google Fonts moved from CSS `@import` to `wp_enqueue_style()`
- Captcha changed from `wp_hash()` to simple arithmetic validation
- Theme activation hook auto-creates Home + Blog + legal pages
- OG meta/image fixed, deprecated `wp_title()` replaced

### Round 2 — 7 User-Reported Issues
1. Hero background image missing — removed `loading="lazy"`
2. Labor slider not auto-updating — exposed `updateEstimates` globally
3. Supplier cards missing border CSS — added `.hud-border` class
4. 3D grid not loading properly — added `w-1/4`, `h-1/4` CSS
5. Footer issues — redesigned 4 columns, legal pages, hourly cron
6. Front page meta box — info notice instead of hiding editor
7. Campaign email selection — Send to Selected + Send to All

### Round 3 — Additional Fixes
- Hero stat boxes: both `w-64`
- "Standard Contractor Waste" box: restyled with hero-bg.jpg
- 3D grid cell class `border-brand-purple-40` → `border-brand-purple/40`
- CSS brace balance: 834 open, 834 close
- All PHP files pass `php -l`

### Round 4 — Batch Campaign + Orbit/UI Fixes
- **Orbit drag**: document-level mousedown/touchstart with canvas.contains() + button filter
- **Quote button**: reduced sidebar padding, overflow-y-auto, mt-auto bottom section
- **Front page editor**: the_content() section between Hero and Estimator
- **Batch sending (50/hr)**: cron sends 50/hr, tracked via foreman_campaign_progress
- **CSV/textbox import**: textarea + CSV upload in campaign creation form
- **Campaign progress UI**: progress bar, sent/total, completion, extra emails count

### Round 5 — Final Features
- **Pause/Resume campaigns**: toggle button in campaign list, cron skips paused
- **Footer menus**: 3 menu locations (footer-col-1/2/3) replace hardcoded links, fallback preserved
- **Front page Customizer**: Appearance → Customize → Front Page Content — edit hero badge, heading, subheading, stat boxes, extra sections HTML
- **Estimator notice**: added desktop/large screen notice below "Interactive Beta Demonstration Area"
- **Progress index cleanup**: deleting campaigns cleans up progress indices to prevent misalignment

### Blocked
- (none)

## Key Decisions
- Orbit drag uses document-level listeners with target filtering.
- Campaign cron sends 50/hr; manual "Send to All" sends all at once.
- Extra emails from CSV/textbox deduplicated against submission emails.
- Pause flag stored in progress; campaigns can be paused before any cron run.
- Footer columns use WordPress menus with hardcoded fallback.
- Front page text editable via Customizer (theme_mod), defaults match original copy.

## Files Modified (all rounds)
- `style.css` — all missing Tailwind classes
- `assets/js/theme.js` — orbit, estimator, 3D, campaign JS
- `front-page.php` — the_content(), editable text via theme_mod, sidebar spacing, estimator notice
- `footer.php` — wp_nav_menu() for 3 columns with hardcoded fallback
- `functions.php` — menus, cron batch, Customizer fields, activation
- `inc/admin.php` — CSV/textbox import, batch progress, pause/resume, delete cleanup
- `header.php` — favicon, nav menu
