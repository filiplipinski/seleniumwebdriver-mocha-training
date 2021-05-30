const { By, Key } = require("selenium-webdriver");

/**
 *
 * @param {driver} WebDriver Required.
 * @param {date} string Required, "dd-mm-yyyy" format.
 * @param {isParentsApprovalRequired} boolean Optional, default is false. Czy wymagana jest zgoda rodziców?
 * @param {isMedicalCertificateRequired} boolean optional, default is false. Czy wymagana jest zaświadczenie od lekarza?
 *
 * @returns Returns a qualification result. Zwraca wynik kwalifikacji.
 */
const doTestFlow = async ({
  driver,
  date,
  isParentsApprovalRequired = false,
  isMedicalCertificateRequired = false,
}) => {
  await driver
    .findElement(By.id("inputEmail3"))
    .sendKeys("TestImie", Key.RETURN);
  await driver
    .findElement(By.id("inputPassword3"))
    .sendKeys("TestNazwisko", Key.RETURN);
  await driver.findElement(By.id("dataU")).sendKeys(date, Key.RETURN);
  if (isParentsApprovalRequired) {
    await driver.findElement(By.id("rodzice")).click();
  }
  if (isMedicalCertificateRequired) {
    await driver.findElement(By.id("lekarz")).click();
  }
  await driver.findElement(By.className("btn")).click();
  await driver.switchTo().alert().accept();

  const result = await driver.switchTo().alert().getText();
  await driver.switchTo().alert().accept();
  return result;
};

module.exports = { doTestFlow };
