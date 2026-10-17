import sharp from 'sharp';

async function processLogo() {
  const input = sharp('public/images/logo-mark.jpg');
  const { data, info } = await input.raw().toBuffer({ resolveWithObject: true });

  const cx = 512;
  const cy = 508;
  const circleRadius = 295; // radius of the vinyl circle outer gold rim

  // Create RGBA buffer
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const srcIdx = (y * info.width + x) * 3;
      const dstIdx = (y * info.width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      rgba[dstIdx] = r;
      rgba[dstIdx + 1] = g;
      rgba[dstIdx + 2] = b;

      const dist = Math.hypot(x - cx, y - cy);

      if (dist <= circleRadius) {
        // Inside the vinyl disc: completely solid
        rgba[dstIdx + 3] = 255;
      } else {
        // Outside the vinyl disc:
        // Check if this pixel belongs to the gold wing
        const isGold = (r > 80 && g > 65 && r > b * 1.15) || (r > 60 && g > 50 && b < 50);
        const brightness = Math.max(r, g, b);

        if (isGold && brightness > 40) {
          // Wing pixel: solid or semi-solid at edge
          const alpha = Math.min(255, Math.max(0, Math.round((brightness - 25) * 4)));
          rgba[dstIdx + 3] = alpha;
        } else if (dist <= circleRadius + 6) {
          // Antialiasing edge of the outer circle
          const edgeAlpha = Math.round((1 - (dist - circleRadius) / 6) * 255);
          rgba[dstIdx + 3] = Math.max(0, Math.min(255, edgeAlpha));
        } else {
          // Pure transparent outside
          rgba[dstIdx + 3] = 0;
        }
      }
    }
  }

  // Now crop tightly around the emblem with 20px padding
  // minX: ~210, maxX: ~810, minY: ~205, maxY: ~810 -> size roughly 620x620
  // Let's create an 650x650 square centered at (512, 508)
  const cropSize = 650;
  const cropLeft = Math.round(cx - cropSize / 2);
  const cropTop = Math.round(cy - cropSize / 2);

  await sharp(rgba, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
  .png({ quality: 100, compressionLevel: 9 })
  .toFile('public/images/logo-mark-transparent.png');

  console.log('Saved public/images/logo-mark-transparent.png');
}

processLogo().catch(console.error);
