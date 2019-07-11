const boxen = require('boxen');
const imgur = require("imgur");

imgur.setAPIUrl("https://api.imgur.com/3/");

module.exports = async (world) => {
  try {
    // Get the screenshot image as a Base64 string:
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    const screenshotImageBase64 = await world.page.screenshot({
      encoding: "base64",
      fullPage: true
    });

    // Upload it to imgur:
    const { data: { link } } = await imgur.uploadBase64(screenshotImageBase64);

    const message = `SCREENSHOT TAKEN \n\n` +
                    `Screenshot: ${link}`

    console.log();
    console.log(boxen(message, { padding: 1 }));
  } catch(err) {
    console.log(err);
  }
}
