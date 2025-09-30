# Before/After Gallery

A minimal, production-ready Before/After image gallery built with Next.js, TypeScript, Tailwind CSS, and react-compare-slider.

## Features

- ✨ Clean, full-width grid layout with no logos or menus
- 🎨 Uses `react-compare-slider` for smooth, interactive comparisons
- 📁 Auto-discovers image pairs from `/public/input` at build time
- 🖼️ Supports multiple image formats: jpg, jpeg, png, webp, avif
- 📱 Fully responsive with adaptive heights per breakpoint
- ⌨️ Keyboard accessible (arrow keys with 5% increment)
- 🚀 Production-ready: lazy loading, no CLS, optimized performance

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Image Pairs

Drop your before/after image pairs into `/public/input/` with the naming convention:

```
interior_<number>_before.<ext>
interior_<number>_after.<ext>
```

**Examples:**
- `interior_1_before.jpg` + `interior_1_after.jpg`
- `interior_3_before.png` + `interior_3_after.webp`
- `interior_10_before.avif` + `interior_10_after.jpeg`

The `<number>` can be any integer. Pairs are sorted by number in ascending order.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the gallery.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ba-gallery/
├── public/
│   └── input/              # Drop your image pairs here
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind + image styles
│   │   └── page.tsx        # Main page with file discovery
│   └── components/
│       └── BeforeAfter.tsx # Compare slider component
└── package.json
```

## Technical Details

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Slider**: react-compare-slider
- **File Discovery**: Server-side Node.js fs API
- **Image Optimization**: Native lazy loading & async decoding

## Notes

- Incomplete pairs (missing before or after) are automatically skipped
- Mixed image formats are fully supported
- No client-side file scanning—all discovery happens at build/request time
- Zero console noise in production
- Optimized for Lighthouse scores

## License

MIT