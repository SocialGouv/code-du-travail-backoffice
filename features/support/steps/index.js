const { After, Before, Given, Then, When } = require("cucumber");

const takeScreenshotOnFailure = require("../hooks/takeScreenshotOnFailure");

if (process.env.NODE_ENV === undefined) {
  require("dotenv").config({ path: `${__dirname}/../../../.env` });
}

const { NODE_ENV } = process.env;

Before(async function() {
  return await this.start();
});

After(async function(testCase) {
  if (NODE_ENV === "test") await takeScreenshotOnFailure(testCase, this);

  return await this.stop();
});

Given("I am a registered {string}", async function(role) {
  await this.setUserRole(role);
});

When("I log into the application", async function() {
  await this.goToHome();
  await this.login();
});

Then("I should see the subtitle {string}", async function(text) {
  await this.checkSubtitle(text);
});

Then("I should see the title {string}", async function(text) {
  await this.checkTitle(text);
});
