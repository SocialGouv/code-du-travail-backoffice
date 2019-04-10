const { setWorldConstructor } = require("cucumber");
const { expect } = require("chai");
const puppeteer = require("puppeteer");

require("dotenv").config({ path: `${__dirname}/../../../.env` });

const { WEB_URI } = process.env;
const ONE_SECOND = 1000;

class World {
  async start() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    await this.page.waitForSelectors([
      `input[name="email"]`,
      `input[name="password"]`,
      `button`
    ]);

    const $email = await this.page.$(`input[name="email"]`);
    const $password = await this.page.$(`input[name="password"]`);
    const $button = await this.page.$(`button`);

    await $email.type(this.user.email);
    await $password.type(this.user.password);

    await $button.click();
  }

  async checkSubtitle(text) {
    const subtitleSelector = "h2";
    await this.page.waitForSelector(subtitleSelector);

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
