require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["https://tcsysten.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const generatePdfWithPuppeteer = async (data) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000,
  });
  const page = await browser.newPage();

  const htmlTemplatePath = path.join(
    __dirname,
    "..",
    "src",
    "assets",
    "tabela.html"
  );
  if (!fs.existsSync(htmlTemplatePath)) {
    throw new Error("Arquivo de template HTML não encontrado!");
  }

  const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
  const template = handlebars.compile(htmlTemplate);
  const htmlContent = template(data);

  console.log("HTML gerado:", htmlContent);

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
  const pdfPath = `./uploads/pedido-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath;
};

app.get("/", (req, res) => {
  res.send("Servidor funcionando corretamente!");
});

app.post("/send-email", async (req, res) => {
  console.log("Dados recebidos no backend:", req.body);

  try {
    const emailData = req.body;

    if (!emailData || !emailData.cpf || !emailData.description) {
      console.log("Dados inválidos recebidos:", emailData);
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos." });
    }

    if (
      !emailData.rows ||
      !Array.isArray(emailData.rows) ||
      emailData.rows.length === 0
    ) {
      console.log("O campo 'rows' está vazio ou não foi preenchido.");
      return res
        .status(400)
        .json({
          success: false,
          message: "O campo 'rows' é obrigatório e deve ser um array.",
        });
    }

    console.log("Dados recebidos:", emailData.rows);
    const pdfPath = await generatePdfWithPuppeteer(emailData);
    console.log("PDF Gerado em:", pdfPath);

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Novo Pedido - Cliente ${emailData.client}`,
      text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
      attachments: [{ filename: `pedido-${Date.now()}.pdf`, path: pdfPath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso para:", mailOptions.to);

    fs.unlinkSync(pdfPath);
    res.json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar e-mail." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
