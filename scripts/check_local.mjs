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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // Retina 2x scale for ultra crisp inspection

  console.log('Navigating to http://localhost:4173 ...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });

  // 1. Screenshot of the entire navbar
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: path.join(ARTIFACTS_DIR, 'new_navbar.png') });
    console.log('Saved new_navbar.png');
  }

  // 2. Zoomed-in screenshot of just the Logo brand mark
  const logoElement = await page.$('header a');
  if (logoElement) {
    await logoElement.screenshot({ path: path.join(ARTIFACTS_DIR, 'new_logo_closeup.png') });
    console.log('Saved new_logo_closeup.png');
  }

  // 3. Scroll to footer and take footer logo screenshot
  const footer = await page.$('footer');
  if (footer) {
    await footer.screenshot({ path: path.join(ARTIFACTS_DIR, 'new_footer.png') });
    console.log('Saved new_footer.png');
  }

  // 4. Hero section screenshot
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'new_hero_page.png'), clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved new_hero_page.png');

  await browser.close();
  console.log('Inspection complete!');
}

main().catch(err => {
  console.error('Puppeteer inspection failed:', err);
  process.exit(1);
});
