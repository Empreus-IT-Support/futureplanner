Local image hosting. Nothing here may be hotlinked from a third-party CDN.

HERO
  gold-coast-skyline.jpg is the photo the handover named (City of Gold Coast,
  Unsplash License, free for commercial use), downloaded and served locally.
  next/image handles WebP/AVIF conversion, so no second file is needed.

  It is interim. Replace it with a team or office photograph and update
  heroImage in data/site.ts. Setting that to null falls back to a designed
  navy panel. The same file is reused at different crops beside the About
  copy and behind the closing band.

TEXTURE
  texture-contours.svg is authored in this repo, not downloaded. Brand colours
  only. It sits behind tinted sections.

HEADSHOTS
  Portrait 4:5 crop, 1200x1500px minimum, consistent lighting and background
  across all six. WebP with a JPG fallback. Alt text names the person and their
  role. Point each member's `photo` in data/team.ts at the file.

  No photo goes up before that person's written consent has been returned.
  Taking someone down means deleting the file from here as well as clearing the
  entry in data/team.ts, and purging any cached or CDN copy.

FILENAMES
  Restricted words must not appear in image filenames. npm run check:words
  checks this folder.
