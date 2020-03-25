const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const { setDefaultTimeout, setWorldConstructor } = require("cucumber");

dotenv.config({ path: `${__dirname}/../../../.env` });
const { CI, APP_DOMAIN, APP_PORT_PUBLIC, APP_SCHEME } = process.env;

const APP_URI = `${APP_SCHEME}://${APP_DOMAIN}:${APP_PORT_PUBLIC}`;

// Increase default cucumber timeout from 5s to 30s:
setDefaultTimeout(30000);

class World {
  async start() {
    this.browser = await puppeteer.launch({
      args: ["--disable-setuid-sandbox", "--no-sandbox", `--window-size=1600,1024`],
      defaultViewport: { height: 768, width: 1280 },
      devtools: CI !== "true",
      headless: CI === "true",
    });
    this.page = (await this.browser.pages())[0];
    this.extendPage();
  }

  extendPage() {
    this.page.waitForSelectors = function (selectors) {
      return Promise.all(selectors.map(selector => this.waitForSelector(selector)));
    }.bind(this.page);
  }

  setUserRole(role) {
    switch (role) {
      case "administrator":
        this.user = {
          email: "doris@sea.com",
          password: "Azerty123",
        };
        break;

      case "contributor":
        this.user = {
          email: "nemo@sea.com",
          password: "Azerty123",
        };
        break;

      case "regional administrator":
        this.user = {
          email: "deb@sea.com",
          password: "Azerty123",
        };
        break;
    }
  }

  async goToHome() {
    await this.page.goto(APP_URI);
  }

  async login() {
    await this.page.waitForSelectors([`input[name="email"]`, `input[name="password"]`, `button`]);

    const $email = await this.page.$(`input[name="email"]`);
    const $password = await this.page.$(`input[name="password"]`);
    const $button = await this.page.$(`button`);

    await $email.type(this.user.email);
    await $password.type(this.user.password);

    await Promise.all([this.page.waitForNavigation(), $button.click()]);
  }

  async checkSubtitle(text) {
    const subtitleSelector = "h2";
    await this.page.waitForSelector(subtitleSelector);

    const subtitleTexts = await this.page.evaluate(
      subtitleSelector =>
        [...document.querySelectorAll(subtitleSelector)].map(({ innerText }) => innerText),
      subtitleSelector,
    );

    expect(subtitleTexts).to.include(text);
  }

  async checkTitle(text) {
    const titleSelector = "h1";
    await this.page.waitForSelector(titleSelector);

    const titleText = await this.page.evaluate(
      titleSelector => document.querySelector(titleSelector).innerText,
      titleSelector,
    );

    expect(titleText).to.eql(text);
  }

  async stop() {
    await this.page.close();
    await this.browser.close();
  }
}

setWorldConstructor(World);
