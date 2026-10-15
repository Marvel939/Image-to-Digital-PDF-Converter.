# Paperlight

A small, browser-based document scanner. Capture a document with your phone camera or upload photos, adjust the four corners to correct perspective, clean up the image, and download a multipage PDF. Images are processed locally and are never uploaded to a server.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci --cache /tmp/document-npm-cache
npm run dev
```

Open the development server in your browser. On phones, **Take a photo** requests the rear camera through the native file picker; desktop browsers may offer a file picker instead. Deploy using HTTPS for camera support. No API keys or backend are required.

## Use

1. Upload JPG, PNG, or WEBP documents, or take a photo. Up to 30 pages, 25 MB per file; working images are resized to a maximum of 2200 pixels per side.
2. Drag corner dots clockwise around the document, starting at the top left. Click **Apply crop** to straighten perspective. Use **Rotate** if needed. Crop changes are included only after applying them.
3. Choose Clean, Grayscale, or Original. Adjust contrast and brightness in Clean or Grayscale mode. Reset restores the uploaded image.
4. Drag page cards to reorder; × removes a page.
5. Name the document, choose A4, US Letter, or Fit to image, and download.

The PDF contains enhanced page images, not searchable OCR text or reconstructed vector typography. Results depend on focus, lighting, resolution, and shadows. Clean mode improves contrast and whitens bright paper; it cannot reconstruct obscured details. Original preserves source colors. Standard paper sizes fit the whole image within an 8 mm margin.

## Validate

```sh
npm run build
npm test
```

Tests use `/usr/bin/chromium` when installed, otherwise Playwright’s bundled Chromium (`npx playwright install chromium`). Set `CHROMIUM_PATH` to override.

Tests exercise actual image import, filters, rotation, perspective crop, reset, reordering, page deletion, invalid uploads, mobile layout, and two-page PDF download. Build output is in `dist/` and can be hosted on any static HTTPS host. `npm run preview` serves the production build locally.

System fonts keep the interface independent of external font services. Document processing and PDF generation work without external services once application assets are loaded.
