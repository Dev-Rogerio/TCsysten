require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = "uploads";

// Criar pasta de uploads se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Caminho correto do Chromium
const CHROMIUM_PATH =
  "C:\\Users\\roger\\.cache\\puppeteer\\chrome\\win64-134.0.6998.35\\chrome-win64\\chrome.exe";
console.log("Usando Chromium em:", CHROMIUM_PATH);

// Função para gerar PDF com Puppeteer
async function generatePDF() {
  let browser;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent("<h1>Teste PDF</h1>");
    const pdfPath = path.join(uploadDir, "example.pdf");
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();
    return pdfPath;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    if (browser) await browser.close();
    return null;
  }
}

// Rota para enviar e-mail com PDF
app.post("/send-email", upload.single("pdf"), async (req, res) => {
  try {
    let pdfPath = req.file ? req.file.path : await generatePDF();
    if (!pdfPath) {
      return res.status(500).json({ error: "Falha ao gerar o PDF" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Enviando PDF pelo Node.js",
      text: "Segue o PDF em anexo.",
      attachments: [{ filename: path.basename(pdfPath), path: pdfPath }],
    };

    await transporter.sendMail(mailOptions);
    fs.unlinkSync(pdfPath);
    res.json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res
      .status(500)
      .json({ error: "Erro ao enviar e-mail", details: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
