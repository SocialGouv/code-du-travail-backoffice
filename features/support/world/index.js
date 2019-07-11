const { setDefaultTimeout, setWorldConstructor } = require("cucumber");
const { expect } = require("chai");
const puppeteer = require("puppeteer");

const waitFor = require("../helpers/waitFor");
const takeScreenshot = require("../helpers/takeScreenshot");

if (process.env.WEB_URI === undefined) {
  require("dotenv").config({ path: `${__dirname}/../../../.env` });
}

const { WEB_URI } = process.env;

// Increase default cucumber timeout from 5s to 10s:
setDefaultTimeout(90000);

class World {
  async start() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // devtools: true,
      // headless: false
    });
    this.page = await this.browser.newPage();
    this.extendPage();
  }

  extendPage() {
    this.page.waitForSelectors = function(selectors) {
      return Promise.all(
        selectors.map(selector => this.waitForSelector(selector))
      );
    }.bind(this.page);
  }

  setUserRole(role) {
    switch (role) {
      case "administrator":
        this.user = {
          email: "administrator@example.com",
          password: "Azerty123"
        };
        break;

      case "contributor":
        this.user = {
          email: "contributor@example.com",
          password: "Azerty123"
        };
        break;
    }
  }

  async goToHome() {
    await this.page.goto(WEB_URI);
  }

  async login() {
    console.log("login()")
    // await waitFor(10000)

    await this.page.waitForSelectors([
      `input[name="email"]`,
      `input[name="password"]`,
      `button`
    ]);

    const $email = await this.page.$(`input[name="email"]`);
    const $password = await this.page.$(`input[name="password"]`);
    const $button = await this.page.$(`button`);

    console.log(1, this.user.email)
    console.log(1, this.user.password)
    await takeScreenshot(this);

    await $email.type(this.user.email);
    await $password.type(this.user.password);

    console.log(2, this.user.email)
    console.log(2, this.user.password)
    await takeScreenshot(this);

    await Promise.all([
      this.page.waitForNavigation(),
      $button.click()
    ]);

    console.log(3, this.user.email)
    console.log(3, this.user.password)
    await takeScreenshot(this);
  }

  async checkSubtitle(text) {
    console.log(1, "checkSubtitle")

    const subtitleSelector = "h2";
    await this.page.waitForSelector(subtitleSelector, { timeout: 60000 });

    console.log(2, "checkSubtitle")

    const subtitleTexts = await this.page.evaluate(
      subtitleSelector => [...document.querySelectorAll(subtitleSelector)]
        .map(({ innerText }) => innerText),
      subtitleSelector
    );

    expect(subtitleTexts).to.include(text);
  }

  async checkTitle(text) {
    const titleSelector = "h1";
    await this.page.waitForSelector(titleSelector);

    const titleText = await this.page.evaluate(
      titleSelector => document.querySelector(titleSelector).innerText,
      titleSelector
    );

    expect(titleText).to.eql(text);
  }

  async stop() {
    await this.browser.close();
  }
}

setWorldConstructor(World);
