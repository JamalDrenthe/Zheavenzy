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
  await page.setViewport({ width: 1000, height: 1100, deviceScaleFactor: 2 });

  const b64_16 = fs.readFileSync('public/favicon-16x16.png').toString('base64');
  const b64_32 = fs.readFileSync('public/favicon-32x32.png').toString('base64');
  const b64_48 = fs.readFileSync('public/favicon-48x48.png').toString('base64');
  const b64_apple = fs.readFileSync('public/apple-touch-icon.png').toString('base64');
  const b64_android = fs.readFileSync('public/android-chrome-192x192.png').toString('base64');
  const b64_avatar = fs.readFileSync('public/social-avatar.png').toString('base64');
  const b64_og = fs.readFileSync('public/og-image.png').toString('base64');
  const svgText = fs.readFileSync('public/favicon.svg', 'utf-8');
  const b64_svg = Buffer.from(svgText).toString('base64');

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070709; color: #fff; }
      h1 { font-size: 20px; font-weight: 800; color: #D4AF37; margin-top: 0; margin-bottom: 24px; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 12px; }
      h2 { font-size: 13px; margin-top: 0; margin-bottom: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1.5px; }
      .container { display: flex; flex-direction: column; gap: 28px; }
      .tab-bar-dark { background: #202124; padding: 12px 24px; border-radius: 10px; display: flex; align-items: center; gap: 24px; border: 1px solid rgba(255,255,255,0.06); }
      .tab-bar-light { background: #dee1e6; padding: 12px 24px; border-radius: 10px; display: flex; align-items: center; gap: 24px; }
      .tab { display: inline-flex; align-items: center; gap: 10px; background: #2d2e31; padding: 8px 16px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 500; color: #e8eaed; }
      .tab-light { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; padding: 8px 16px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 500; color: #202124; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .card-row { display: flex; align-items: center; gap: 24px; padding: 20px; background: #111116; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
      .item-box { display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 11px; color: rgba(255,255,255,0.7); text-align: center; }
      .og-card { max-width: 540px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(212,175,55,0.3); box-shadow: 0 12px 30px rgba(0,0,0,0.6); }
      .og-card img { width: 100%; height: auto; display: block; }
    </style>
  </head>
  <body>
    <h1>Zheavenzy • LogoAnywhere Asset Pack Verification</h1>
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
        <h2>3. Mobile & PWA App Icons (Safe Zones)</h2>
        <div class="card-row">
          <div class="item-box">
            <img src="data:image/png;base64,${b64_apple}" width="72" height="72" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);" />
            <span>Apple Touch<br>(180x180, iOS squircle)</span>
          </div>
          <div class="item-box">
            <img src="data:image/png;base64,${b64_android}" width="72" height="72" style="border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);" />
            <span>Android Adaptive<br>(192x192, Circle)</span>
          </div>
          <div class="item-box">
            <img src="data:image/png;base64,${b64_avatar}" width="72" height="72" style="border-radius: 50%; border: 1px solid rgba(212,175,55,0.4);" />
            <span>Social Profile Avatar<br>(1000x1000, 20% margin)</span>
          </div>
          <div class="item-box">
            <img src="data:image/png;base64,${b64_48}" width="48" height="48" />
            <span>48x48 PNG</span>
          </div>
          <div class="item-box">
            <img src="data:image/png;base64,${b64_32}" width="32" height="32" />
            <span>32x32 PNG</span>
          </div>
          <div class="item-box">
            <img src="data:image/png;base64,${b64_16}" width="16" height="16" />
            <span>16x16 PNG</span>
          </div>
        </div>
      </div>

      <div>
        <h2>4. Open Graph Social Share Preview (WhatsApp / LinkedIn / Twitter)</h2>
        <div class="og-card">
          <img src="data:image/png;base64,${b64_og}" />
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
