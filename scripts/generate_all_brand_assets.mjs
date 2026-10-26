import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAllBrandAssets() {
  const masterSource = 'public/images/logo-mark-transparent.png';
  const bgHex = '#050505';
  const bgRgba = { r: 5, g: 5, b: 5, alpha: 1 };

  console.log('✨ LogoAnywhere: Generating complete Digital Brand Asset Pack for Zheavenzy...');

  // 1. Favicon PNGs (16x16, 32x32, 48x48)
  const sizes = [16, 32, 48];
  const pngBuffers = [];

  for (const s of sizes) {
    const sigma = s === 16 ? 0.75 : s === 32 ? 0.6 : 0.4;
    const buf = await sharp(masterSource)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .sharpen({ sigma, m1: 1.4, m2: 0.6 })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const outFile = `public/favicon-${s}x${s}.png`;
    fs.writeFileSync(outFile, buf);
    console.log(`  ✓ ${outFile} (${s}x${s} RGBA)`);
    pngBuffers.push({ size: s, buffer: buf });
  }

  // 2. Real Windows Multi-Size ICO Container (favicon.ico containing 16x16, 32x32, 48x48)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(sizes.length, 4); // count of images

  let offset = 6 + sizes.length * 16;
  const dirEntries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size, 0); // width
    entry.writeUInt8(img.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size of PNG stream
    entry.writeUInt32LE(offset, 12); // offset in file
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('  ✓ public/favicon.ico (Multi-size ICO: 16x16, 32x32, 48x48)');

  // 3. Apple Touch Icon (180x180 - Solid #050505 background, logo inside 140x140 safe zone)
  const bgApple = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: bgRgba
    }
  }).png().toBuffer();

  const appleLogo = await sharp(masterSource)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(bgApple)
    .composite([{ input: appleLogo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile('public/apple-touch-icon.png');
  console.log('  ✓ public/apple-touch-icon.png (180x180, solid #050505, 140px safe zone)');

  // 4. Android / PWA Icons (192x192 and 512x512, solid background with 20% safe margin)
  for (const s of [192, 512]) {
    const bg = await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: bgRgba
      }
    }).png().toBuffer();

    const innerSize = Math.round(s * 0.78);
    const pwaLogo = await sharp(masterSource)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const outFile = `public/android-chrome-${s}x${s}.png`;
    await sharp(bg)
      .composite([{ input: pwaLogo, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(outFile);
    console.log(`  ✓ ${outFile} (${s}x${s}, 20% safe margin, maskable)`);
  }

  // 5. Social Media Avatar (1000x1000, solid #050505, 20% circular safe margin)
  const bgAvatar = await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: bgRgba
    }
  }).png().toBuffer();

  const avatarLogo = await sharp(masterSource)
    .resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(bgAvatar)
    .composite([{ input: avatarLogo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile('public/social-avatar.png');
  console.log('  ✓ public/social-avatar.png (1000x1000, 20% circular safe-zone for Instagram/LinkedIn)');

  // 6. Favicon SVG (Scalable vector container with 512x512 high-res embedded artwork)
  const svgArtworkBuf = await sharp(masterSource)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const b64Svg = svgArtworkBuf.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#D4AF37" flood-opacity="0.3" />
    </filter>
  </defs>
  <image href="data:image/png;base64,${b64Svg}" width="512" height="512" filter="url(#gold-glow)" />
</svg>
`;
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf-8');
  console.log('  ✓ public/favicon.svg (512x512 crisp vector container with subtle gold glow)');

  // 7. Open Graph Preview Image (1200x630 - High Luxury Link Previews)
  // Create luxury canvas with radial glow and branded typographic lockup
  const ogSvgOverlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.22" />
      <stop offset="60%" stop-color="#D4AF37" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#050505" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F5D061" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#AA7C11" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.2" />
    </linearGradient>
  </defs>

  <!-- Background radial ambient light -->
  <rect x="0" y="0" width="1200" height="630" fill="#050505" />
  <ellipse cx="600" cy="245" rx="520" ry="260" fill="url(#goldGlow)" />

  <!-- Subtle outer luxury border -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#borderGrad)" stroke-width="1.5" />

  <!-- Subtle inner corner markings -->
  <path d="M 44 60 L 44 44 L 60 44" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.6" />
  <path d="M 1156 60 L 1156 44 L 1140 44" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.6" />
  <path d="M 44 570 L 44 586 L 60 586" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.6" />
  <path d="M 1156 570 L 1156 586 L 1140 586" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.6" />

  <!-- Typography -->
  <text x="600" y="465" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="46" letter-spacing="14" fill="#FFFFFF">
    ZHEAVENZY
  </text>
  <text x="600" y="515" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-weight="600" font-size="15" letter-spacing="6" fill="#D4AF37">
    PLATFORM VOOR ONAFHANKELIJKE ARTIESTEN
  </text>
  <text x="600" y="555" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-weight="400" font-size="13" letter-spacing="3" fill="#888888">
    MUZIEKDISTRIBUTIE  •  STUDIO  •  MARKETING  •  NETWERK
  </text>
</svg>
`;

  const ogEmblem = await sharp(masterSource)
    .resize(270, 270, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const ogComposite = await sharp(Buffer.from(ogSvgOverlay))
    .composite([
      {
        input: ogEmblem,
        top: 110,
        left: Math.round((1200 - 270) / 2)
      }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('public/og-image.png', ogComposite);
  console.log('  ✓ public/og-image.png (1200x630, WhatsApp/LinkedIn/Twitter safe-zone centered)');

  // Also write og-image.jpg for maximum backwards compatibility
  await sharp(ogComposite)
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/og-image.jpg');
  console.log('  ✓ public/og-image.jpg (1200x630 JPEG fallback)');

  // 8. Site Webmanifest
  const webmanifest = {
    name: "Zheavenzy",
    short_name: "Zheavenzy",
    description: "Zheavenzy: Platform voor onafhankelijke artiesten",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };

  fs.writeFileSync('public/site.webmanifest', JSON.stringify(webmanifest, null, 2), 'utf-8');
  console.log('  ✓ public/site.webmanifest updated');

  console.log('\n🎉 Brand asset pack successfully generated in public/ directory!');
}

generateAllBrandAssets().catch((err) => {
  console.error('Error generating brand assets:', err);
  process.exit(1);
});
