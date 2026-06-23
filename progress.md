# AI Project - Foreman

## Current Branch
- `edits` branch — active development in `foreman4/`
- `master` branch — `foreman3/` backup (original static replica)

## Foreman4 — Enhanced Version

### What We've Done (chronological)
- Moved layer toggles (electrical/plumbing/structural) from absolute inside canvas to static footer right side, vertical stack
- Removed overlapping absolute toolbar positions — orbit/pan/auto stays top-right, footer is static
- Added orbit/pan mouse drag handlers on `#spline-3d-canvas`
- Fixed dark grid items (structural) — changed to amber tones
- Removed "Slide/Pinch Or Zoom Scroll" hint text
- Changed spawner icon from ◍ to +
- Moved reset/zoom bar to static footer below canvas
- Removed conduit SVG (dashed paths causing black triangles)
- Added Spatial Workspace Engine Toggle (CAD/WebGL) in right toolbar
- Mobile: removed hidden classes, mobile overlay, all mobile fallbacks
- Changed nav from sticky to fixed top-0 with pt-[72px] offset
- Added amber orientation tip under 3D section description
- Added Spline Scene section from 21st.dev (serafim/splite) before footer
  - Uses `@splinetool/runtime` vanilla JS via CDN dynamic import
  - Canvas-based 3D viewer (not React, not web component)
  - Structure: badge → gradient heading → description → 4 feature items → dependency badges → canvas
  - Graceful fallback if scene URL fails
  - Scene: NEXBOT robot character from community file `615b9422-9985-43f6-8593-d7d7bc3b0be1`

### Key Decisions
- Fixed nav instead of sticky to avoid mobile browser quirks
- Removed all mobile-specific overlays/fallbacks — simple orientation text tip instead
- Spline Scene uses `@splinetool/runtime` Application class directly (same engine as React component, no React)

### Known Issues
- Spline scene URL might not work (community UUID ≠ scene export hash)
- Lots of missing Tailwind utility classes — added manually to CSS as needed

## Next Steps
- (waiting for user instruction)
