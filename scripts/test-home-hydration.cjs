const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /hydration|server rendered/i.test(message.text())) errors.push(message.text()); });
    await page.goto('http://localhost:3000/');
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.waitForTimeout(1500);
    await page.evaluate(() => caches.open('iyonm-stale-test'));
    await page.reload();
    await page.waitForTimeout(1500);
    const card = page.locator('.thick-tool-card').filter({ has: page.locator('.thick-card-title', { hasText: /^OCR PDF$/ }) });
    assert.equal(await card.locator('.thick-card-description').innerText(), 'Extract text from scanned PDFs.');
    assert.equal((await page.evaluate(() => caches.keys())).includes('iyonm-stale-test'), false);
    assert.deepEqual(errors, []);
    console.log('PASS: homepage hydration, current OCR copy, and stale IYONM cache cleanup.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
