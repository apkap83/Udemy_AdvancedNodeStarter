const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("the header has the correct text", async () => {
  await page.waitForSelector("a.brand-logo");
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({
    name: "session",
    value: session,
    url: "http://localhost:3000",
  });
  await page.setCookie({
    name: "session.sig",
    value: sig,
    url: "http://localhost:3000",
  });

  // Go to page with the cookies this time...
  await page.goto("http://localhost:3000");
  await page.waitForSelector('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
