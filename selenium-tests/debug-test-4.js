import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

(async function debug() {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--window-size=1366,768');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  try {
    await driver.get('http://localhost:5173');
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Email OTP')]")), 5000);
    const emailTab = await driver.findElement(By.xpath("//button[contains(., 'Email OTP')]"));
    await emailTab.click();
    await driver.wait(until.elementLocated(By.id('email-otp-address')), 5000);
    const passwordTab = await driver.findElement(By.xpath("//button[contains(., 'Password')]"));
    await passwordTab.click();
    
    const submitBtn = await driver.wait(until.elementLocated(By.id('login-submit-password')), 5000);
    await driver.wait(until.elementIsVisible(submitBtn), 5000);
    
    const elemAtPoint = await driver.executeScript(() => {
      const el = document.elementFromPoint(671, 673);
      return el ? { tagName: el.tagName, className: el.className, outerHTML: el.outerHTML } : null;
    });
    console.log("ELEMENT AT (671, 673):", JSON.stringify(elemAtPoint, null, 2));

    await submitBtn.click();
  } catch (err) {
    console.log("ERROR MESSAGE:\n", err.message);
  } finally {
    await driver.quit();
  }
})();
