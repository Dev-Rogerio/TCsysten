const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch();
    console.log("Puppeteer iniciou corretamente!");
    await browser.close();
  } catch (error) {
    console.error("Erro ao iniciar o Puppeteer:", error);
  }
})();
