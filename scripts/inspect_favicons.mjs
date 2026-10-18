import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = '/home/jsdrenthe/.gemini/antigravity/brain/2e9f5c56-b59e-4c11-a78d-80145cedda32';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `/home/jsdrenthe/.gemini/antigravity/brain/2e9f5c56-b59e-4c11-a78d-80145cedda32/scratch/libs/usr/lib/x86_64-linux-gnu:${process.env.LD_LIBRARY_PATH || ''}`
    }
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 750, deviceScaleFactor: 2 });

  const b64_16 = fs.readFileSync('public/favicon-16x16.png').toString('base64');
  const b64_32 = fs.readFileSync('public/favicon-32x32.png').toString('base64');
  const b64_48 = fs.readFileSync('public/favicon-48x48.png').toString('base64');
  const b64_apple = fs.readFileSync('public/apple-touch-icon.png').toString('base64');
  const svgText = fs.readFileSync('public/favicon.svg', 'utf-8');
  const b64_svg = Buffer.from(svgText).toString('base64');

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0d; color: #fff; }
      h2 { font-size: 14px; margin-bottom: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1.5px; }
      .container { display: flex; flex-direction: column; gap: 32px; }
      .tab-bar-dark { background: #202124; padding: 12px 24px; border-radius: 10px; display: flex; align-items: center; gap: 24px; border: 1px solid rgba(255,255,255,0.06); }
      .tab-bar-light { background: #dee1e6; padding: 12px 24px; border-radius: 10px; display: flex; align-items: center; gap: 24px; }
      .tab { display: inline-flex; align-items: center; gap: 10px; background: #2d2e31; padding: 8px 16px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 500; color: #e8eaed; }
      .tab-light { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; padding: 8px 16px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 500; color: #202124; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .sizes-row { display: flex; align-items: center; gap: 32px; padding: 24px; background: #121216; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); }
      .size-box { display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 11px; color: rgba(255,255,255,0.7); }
    </style>
  </head>
  <body>
    <div class="container">
      <div>
        <h2>1. Dark Mode Browser Tab Simulation (Chrome / Brave / Edge)</h2>
        <div class="tab-bar-dark">
          <div class="tab">
            <img src="data:image/svg+xml;base64,${b64_svg}" width="16" height="16" />
            <span>Zheavenzy: Het platform voor independent artiesten</span>
          </div>
          <div class="tab">
            <img src="data:image/png;base64,${b64_32}" width="16" height="16" />
            <span>32x32 Favicon Tab</span>
          </div>
        </div>
      </div>

      <div>
        <h2>2. Light Mode Browser Tab Simulation (Safari / Chrome Light)</h2>
        <div class="tab-bar-light">
          <div class="tab-light">
            <img src="data:image/svg+xml;base64,${b64_svg}" width="16" height="16" />
            <span>Zheavenzy: Het platform voor independent artiesten</span>
          </div>
          <div class="tab-light">
            <img src="data:image/png;base64,${b64_32}" width="16" height="16" />
            <span>32x32 Favicon Tab</span>
          </div>
        </div>
      </div>

      <div>
        <h2>3. Scale & Clarity Verification</h2>
        <div class="sizes-row">
          <div class="size-box">
            <img src="data:image/png;base64,${b64_16}" width="16" height="16" />
            <span>16x16 PNG</span>
          </div>
          <div class="size-box">
            <img src="data:image/png;base64,${b64_32}" width="32" height="32" />
            <span>32x32 PNG</span>
          </div>
          <div class="size-box">
            <img src="data:image/png;base64,${b64_48}" width="48" height="48" />
            <span>48x48 PNG</span>
          </div>
          <div class="size-box">
            <img src="data:image/svg+xml;base64,${b64_svg}" width="64" height="64" />
            <span>64x64 SVG</span>
          </div>
          <div class="size-box">
            <img src="data:image/png;base64,${b64_apple}" width="80" height="80" style="border-radius: 18px;" />
            <span>Apple Touch (180x180)</span>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'favicon_test_results.png'), fullPage: true });
  console.log('Saved favicon_test_results.png');

  await browser.close();
}

main().catch(console.error);
