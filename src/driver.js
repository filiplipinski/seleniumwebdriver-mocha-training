const { Builder } = require("selenium-webdriver");
const config = require("./config");

const getDriver = async () => {
  return await new Builder().forBrowser(config.browser).build();
};

module.exports = { getDriver };
