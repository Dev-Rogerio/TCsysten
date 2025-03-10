require("dotenv").config();
const { google } = require("googleapis");
const OAuth2Client = google.auth.OAuth2; // Atribui o OAuth2Client a partir de google.auth
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

// Configuração do OAuth2
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Configuração de CORS
const corsOptions = {
  origin: ["https://tcsysten.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Função para gerar o PDF com Puppeteer
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

// Rota para iniciar o processo de autenticação OAuth
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"], // Permissões de acesso
  });
  res.redirect(authUrl);
});

// Rota de callback após autenticação
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    // A obtenção dos tokens precisa ser dentro de uma função async
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens); // Armazena os tokens no servidor

    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);

    res.send("Autenticado com sucesso!");
  } catch (error) {
    res.status(500).send("Erro na autenticação");
  }
});

// Função para criar o transporter com OAuth2
async function createTransporter(auth) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_FROM,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: auth.credentials.refresh_token, // Usando os tokens salvos
      accessToken: auth.credentials.access_token, // Usando os tokens salvos
    },
  });
  return transporter;
}

// Função para enviar e-mail
async function sendEmail(auth, emailData) {
  const transporter = await createTransporter(auth);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Novo Pedido - Cliente ${emailData.client}`,
    text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
    attachments: [
      { filename: `pedido-${Date.now()}.pdf`, path: emailData.pdfPath },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log("E-mail enviado com sucesso para:", mailOptions.to);
}

// Rota para enviar e-mail com dados de pedido
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
      return res.status(400).json({
        success: false,
        message: "O campo 'rows' é obrigatório e deve ser um array.",
      });
    }

    console.log("Dados recebidos:", emailData.rows);
    const pdfPath = await generatePdfWithPuppeteer(emailData);
    console.log("PDF Gerado em:", pdfPath);

    emailData.pdfPath = pdfPath;
    await sendEmail(oauth2Client, emailData);

    fs.unlinkSync(pdfPath); // Deleta o arquivo PDF após o envio do e-mail
    res.json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar e-mail." });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
