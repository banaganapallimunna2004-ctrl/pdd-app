import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..', '..');
const REPORTS_DIR = path.join(__dirname, '..', 'reports');
const ARTIFACTS_DIR = path.join(__dirname, '..', 'artifacts');
const SCREENSHOTS_DIR = path.join(ARTIFACTS_DIR, 'screenshots');

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const VITE_APP_BASE_URL = process.env.VITE_APP_BASE_URL || 'http://localhost:5173';
const VITE_EMAIL = process.env.E2E_TEST_EMAIL || '';
const VITE_PASSWORD = process.env.E2E_TEST_PASSWORD || '';

// NOTE: true end-to-end auth requires valid credentials in your DB.
// If not set, we still run UI navigation smoke tests.

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function saveScreenshot(driver, name) {
  return driver.takeScreenshot().then((data) => {
    const filePath = path.join(SCREENSHOTS_DIR, name);
    fs.writeFileSync(filePath, data, 'base64');
    return filePath;
  });
}

async function waitForVisible(driver, locator, timeoutMs = 15000) {
  const el = await driver.wait(until.elementLocated(locator), timeoutMs);
  await driver.wait(until.elementIsVisible(el), timeoutMs);
  return el;
}

const tests = [
  {
    name: 'Open Login page and verify tabs',
    run: async (driver) => {
      await driver.get(`${VITE_APP_BASE_URL}/`);
      await waitForVisible(driver, By.xpath("//button[contains(., 'Phone OTP')]"));
      await waitForVisible(driver, By.xpath("//button[contains(., 'Email Login')]"));
    },
  },
  {
    name: 'Verify email flow page loads at /verify without token',
    run: async (driver) => {
      await driver.get(`${VITE_APP_BASE_URL}/verify`);
      // Page shows "Verify your email..." when token missing
      await waitForVisible(driver, By.xpath("//*[contains(., 'Verify your email')]"));
    },
  },
  {
    name: 'Optional: Login with valid credentials (if env vars present)',
    conditional: Boolean(VITE_EMAIL && VITE_PASSWORD),
    run: async (driver) => {
      await driver.get(`${VITE_APP_BASE_URL}/`);

      // Email login tab may need click depending on default
      // Try to find email input and fill it
      const emailInput = await waitForVisible(driver, By.css('input[type="email"]'));
      const passInput = await waitForVisible(driver, By.css('input[type="password"]'));

      await emailInput.clear();
      await emailInput.sendKeys(VITE_EMAIL);

      await passInput.clear();
      await passInput.sendKeys(VITE_PASSWORD);

      const submitBtn = await waitForVisible(driver, By.xpath("//button[contains(., 'Access Farm Dashboard')]"));
      await submitBtn.click();

      // If auth succeeds, protected route should render dashboard.
      // We check for Dashboard heading or some known UI.
      await driver.wait(
        until.anyOf(
          until.elementLocated(By.xpath("//*[contains(., 'Farmer dashboard')]")),
          until.elementLocated(By.xpath("//*[contains(., 'Dashboard')]"))
        ),
        25000
      );
    },
  },
];

async function main() {
  const stamp = nowStamp();
  const reportFile = path.join(REPORTS_DIR, `e2e-report_${stamp}.html`);

  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--window-size=1366,768');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

  const results = [];

  for (const t of tests) {
    if (t.conditional === false) {
      results.push({ name: t.name, status: 'SKIPPED', detail: 'Missing E2E_TEST_EMAIL/E2E_TEST_PASSWORD' });
      continue;
    }

    const testResult = { name: t.name, status: 'RUNNING', detail: '' };
    try {
      await t.run(driver);
      testResult.status = 'PASS';
    } catch (err) {
      testResult.status = 'FAIL';
      testResult.detail = err?.message || String(err);
      const screenshotName = `FAIL_${t.name.replace(/[^a-z0-9]+/gi, '_').slice(0, 60)}_${stamp}.png`;
      await saveScreenshot(driver, screenshotName);
      testResult.screenshot = screenshotName;
    }
    results.push(testResult);
  }

  await driver.quit();

  // Generate simple HTML report
  const rows = results
    .map((r) => {
      const color = r.status === 'PASS' ? '#16a34a' : r.status === 'FAIL' ? '#ef4444' : '#f59e0b';
      const detail = (r.detail || '').replace(/</g, '<').replace(/>/g, '>');
      const screenshotLine = r.screenshot
        ? `<div style="margin-top:6px; font-size:12px;">Screenshot: <code>${r.screenshot}</code></div>`
        : '';
      return `
        <tr>
          <td style="padding:10px; border:1px solid #334155;">${r.name}</td>
          <td style="padding:10px; border:1px solid #334155; color:${color}; font-weight:700;">${r.status}</td>
          <td style="padding:10px; border:1px solid #334155; font-size:12px;">${detail}${screenshotLine}</td>
        </tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>E2E Report - ${stamp}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#0b1220; color:#e5e7eb; margin:0; padding:24px; }
    .card { background:#111827; border:1px solid #334155; border-radius:12px; padding:18px; }
    table { width:100%; border-collapse:collapse; margin-top:12px; }
    th { text-align:left; padding:10px; border:1px solid #334155; background:#0f172a; }
    code { background:#0f172a; padding:2px 6px; border-radius:6px; border:1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <h1 style="margin:0 0 6px 0; font-size:20px;">Agro AI - Selenium E2E Report</h1>
    <div style="color:#94a3b8; font-size:13px;">Timestamp: ${stamp}</div>
    <table>
      <thead>
        <tr>
          <th>Test</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div style="margin-top:14px; color:#94a3b8; font-size:12px;">
      Screenshots (if any) are in: <code>${path.relative(ROOT, SCREENSHOTS_DIR)}</code>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(reportFile, html, 'utf8');
  console.log(`E2E finished. Report: ${reportFile}`);
}

main().catch(async (err) => {
  console.error('E2E runner crashed:', err);
  process.exit(1);
});

