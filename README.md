# ATLAS Dashboard

Editorial, rankings-led dashboard over the Omnicom Global Advertising Model.
Animated market rankings, streamgraph media-mix, world choropleth, and country drill-down.

## Run locally

```bash
cd app
npm install   # first time only
npm run dev   # http://localhost:5180/
```

Use `npm run preview` to serve a production-style static preview (same folder, no build step required).

## Files

| File | Purpose |
|------|---------|
| `index.html` | Dashboard markup + `Component` logic class — **edit charts/layout here** |
| `atlas.json` | Model data (constant_usd / local / share / growth / per_capita / macro) |
| `geo.json` | Pre-projected world map (Equal Earth SVG paths) |
| `support.js` | Design Component runtime — do not edit |

## Editing

- **Charts / layout / interactions:** methods in the `<script data-dc-script>` block (`barRankNode`, `streamNode`, `mapNode`, `edOverviewA`, `edDrill2`, `edControls`, …)
- **Header / KPI band:** template markup inside `<x-dc>`
- **Palette / fonts:** the `T` theme object (editorial theme is active via `T['2a'] = T.editorial`)
- **Data:** regenerate `atlas.json` from the workbook when figures change (see `../data/` and `../scripts/`)

## Deploy

This folder is a static site — no build step required.

**GitHub Pages:** pushes to `main` deploy automatically via GitHub Actions.  
Live URL: **https://omnicomtools.github.io/ATLAS/**

Ensure `index.html`, `support.js`, `atlas.json`, `geo.json`, and `om-logo.jpg` are all published together.

For other hosts (Vercel, Netlify, internal), deploy this folder as-is.
