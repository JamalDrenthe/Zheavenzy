import sharp from 'sharp';
import fs from 'fs';

async function generateFavicons() {
  const source = 'public/images/logo-mark-transparent.png';

  // 16x16
  await sharp(source)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen({ sigma: 0.8, m1: 1.5, m2: 0.7 })
    .png()
    .toFile('public/favicon-16x16.png');
  console.log('Generated favicon-16x16.png');

  // 32x32
  await sharp(source)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen({ sigma: 0.7, m1: 1.2, m2: 0.5 })
    .png()
    .toFile('public/favicon-32x32.png');
  console.log('Generated favicon-32x32.png');

  // 48x48
  await sharp(source)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon-48x48.png');
  console.log('Generated favicon-48x48.png');

  // Apple touch icon 180x180 (iOS recommends dark solid or subtle gradient background)
  const bgApple = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 10, g: 10, b: 12, alpha: 1 }
    }
  }).png().toBuffer();

  const icon160 = await sharp(source)
    .resize(164, 164, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(bgApple)
    .composite([{ input: icon160, gravity: 'center' }])
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // favicon.ico from 32x32
  const buf32 = await sharp('public/favicon-32x32.png').toBuffer();
  fs.writeFileSync('public/favicon.ico', buf32);
  console.log('Generated favicon.ico');

  // Generate 256x256 base64 for embedding in favicon.svg
  const buf256 = await sharp(source)
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();

  const b64 = buf256.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="256" height="256" />
</svg>
`;
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf-8');
  console.log('Generated favicon.svg (with embedded high-res artwork)');
}

generateFavicons().catch(console.error);
