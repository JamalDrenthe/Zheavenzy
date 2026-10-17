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
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://zheavenzy.one ...');
  await page.goto('https://zheavenzy.one', { waitUntil: 'networkidle2', timeout: 30000 });

  // Screenshot navbar / header
  const header = await page.$('header') || await page.$('nav');
  if (header) {
    await header.screenshot({ path: path.join(ARTIFACTS_DIR, 'current_navbar.png') });
    console.log('Navbar screenshot saved to current_navbar.png');
  }

  // Screenshot hero section
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'current_page_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 800 } });
  console.log('Page hero screenshot saved to current_page_hero.png');

  // Check favicon and title
  const meta = await page.evaluate(() => {
    const icon = document.querySelector('link[rel="icon"]');
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    return {
      title: document.title,
      favicon: icon ? icon.href : null,
      appleIcon: appleIcon ? appleIcon.href : null
    };
  });
  console.log('Page metadata:', meta);

  await browser.close();
  console.log('Done!');
}

main().catch(err => {
  console.error('Puppeteer error:', err);
  process.exit(1);
});
