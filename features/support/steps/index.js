const { After, Before, Given, Then, When } = require("cucumber");

Before(async function() {
  return await this.start();
});

After(async function() {
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
  await this.checkSubtitle(text)
});

Then("I should see the title {string}", async function(text) {
  await this.checkTitle(text)
});
