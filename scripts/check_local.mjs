import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACTS_DIR = '/home/jsdrenthe/.gemini/antigravity/brain/2e9f5c56-b59e-4c11-a78d-80145cedda32';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `/home/jsdrenthe/.gemini/antigravity/brain/2e9f5c56-b59e-4c11-a78d-80145cedda32/scratch/libs/usr/lib/x86_64-linux-gnu:${process.env.LD_LIBRARY_PATH || ''}`
    }
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:4173 ...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });

  // 1. Hero screenshot (showing no particles, authentic guarantees)
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'clean_hero_page.png'),
    clip: { x: 0, y: 0, width: 1440, height: 820 }
  });
  console.log('Saved clean_hero_page.png');

  // 2. Navigate to /lidmaatschap to inspect realistic pricing
  console.log('Navigating to http://localhost:4173/lidmaatschap ...');
  await page.goto('http://localhost:4173/lidmaatschap', { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'clean_pricing_page.png'),
    clip: { x: 0, y: 150, width: 1440, height: 850 }
  });
  console.log('Saved clean_pricing_page.png');

  await browser.close();
  console.log('Inspection complete!');
}

main().catch(err => {
  console.error('Puppeteer inspection failed:', err);
  process.exit(1);
});
