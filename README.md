# Icon assets — not yet generated

This project needs the following real PNG exports before production build:

- icon-192.png (192x192)
- icon-512.png (512x512)
- icon-512-maskable.png (512x512, safe-zone padded for maskable display)
- apple-touch-icon.png (180x180)
- favicon.ico

Source these from the final LifeLegends wordmark/glyph once the brand mark
is designed in Phase 2+. `manifest.json` and `app/layout.tsx` already
reference these exact paths, so dropping correctly-named files in this
folder is the only step needed to activate them.
