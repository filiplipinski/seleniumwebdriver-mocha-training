const { getDriver } = require("../src/driver");
const { doTestFlow } = require("./test.utils");
const assert = require("assert");

describe("WZTO-zawody selenium tests", () => {
  let driver;

  before(async () => {
    driver = await getDriver();
    await driver.get("https://lamp.ii.us.edu.pl/~mtdyd/zawody/");
  });

  beforeEach(async () => {
    driver.navigate().refresh();
  });

  // it closes the chrome browser after all finished tests
  after(async () => {
    await driver.quit();
  });

  it("dziecko wiek ponizej 10 lat, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "20-01-2015",
    });

    assert.strictEqual(result, "Brak kwalifikacji");
  });

  it("dziecko wiek rowny 10 lat, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "29-05-2011",
    });

    assert.strictEqual(result, "Brak kwalifikacji");
  });

  it("skrzat wiek rowny powyzej 10, ponizej 12 lat, ze zgodą rodziców, z zaswiadczeniem lekarza, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-10-2010",
      isParentsApprovalRequired: true,
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Skrzat");
  });

  it("skrzat wiek rowny powyzej 10, ponizej 12 lat, BEZ zgód, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-10-2010",
      isParentsApprovalRequired: true,
    });

    assert.strictEqual(result, "Blad danych");
  });

  it("skrzat wiek rowny 12 lat, bez zaswiadczenie lekarza, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-10-2009",
      isParentsApprovalRequired: true,
    });

    assert.strictEqual(result, "Blad danych");
  });

  it("skrzat wiek rowny 12 lat, ze zgodą rodziców, z zaswiadczeniem lekarza, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-10-2009",
      isParentsApprovalRequired: true,
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Skrzat");
  });

  it("mlodzik wiek rowny powyzej 12, ponizej 14 lat, ze zgodą rodziców, z zaswiadczeniem lekarza, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-11-2008",
      isParentsApprovalRequired: true,
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Mlodzik");
  });

  it("mlodzik wiek rowny powyzej 12, ponizej 14 lat, bez zgód, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-11-2008",
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Blad danych");
  });

  it("mlodzik wiek rowny 14 lat, bez zgód, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-11-2007",
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Blad danych");
  });

  it("mlodzik wiek rowny 14 lat, ze zgodą rodziców, z zaswiadczeniem lekarza, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-11-2007",
      isParentsApprovalRequired: true,
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Mlodzik");
  });

  it("dorosly wiek rowny powyzej 14, ponizej 65 lat, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "11-11-1997",
    });

    assert.strictEqual(result, "Dorosly");
  });

  it("dorosly wiek rowny 65 lat, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "08-05-1956",
    });

    assert.strictEqual(result, "Dorosly");
  });

  it("senior wiek powyzej 65 lat, bez zaswiadczenia lekarza, NIE POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "01-10-1940",
    });

    assert.strictEqual(result, "Blad danych");
  });

  it("senior wiek powyzej 65 lat, z zaswiadczeniem lekarza, POWINNO zostać zakwalifikowane", async () => {
    const result = await doTestFlow({
      driver,
      date: "01-10-1940",
      isMedicalCertificateRequired: true,
    });

    assert.strictEqual(result, "Senior");
  });
});
