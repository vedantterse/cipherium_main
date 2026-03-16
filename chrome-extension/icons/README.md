# Extension Icons

Place the following icon files here:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

You can generate these from the SVG below or use any shield/security icon.

## Quick Icon Generation

Use this SVG as base and resize to needed dimensions:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111118"/>
      <stop offset="100%" style="stop-color:#0a0a0f"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="16" fill="url(#bg)"/>
  <path d="M64 20 L100 35 L100 60 Q100 90 64 108 Q28 90 28 60 L28 35 Z"
        fill="none" stroke="#00ff41" stroke-width="4"/>
  <path d="M50 62 L60 72 L80 52"
        fill="none" stroke="#00ff41" stroke-width="6" stroke-linecap="round"/>
</svg>
```

## Online Tools
- https://realfavicongenerator.net
- https://cloudconvert.com/svg-to-png
