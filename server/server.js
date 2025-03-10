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

// Configuração do CORS
const corsOptions = {
  origin: ["https://tcsysten.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuração do Multer para upload de arquivos
const upload = multer({ dest: "uploads/" });

// Criar diretório uploads se não existir
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Função para gerar o PDF usando Puppeteer
const generatePdfWithPuppeteer = async (data) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000,
  });
  const page = await browser.newPage();

  const htmlTemplatePath = path.join(__dirname, "src", "assets", "tabela.html");

  if (!fs.existsSync(htmlTemplatePath)) {
    throw new Error("Arquivo de template HTML não encontrado!");
  }

  const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
  const template = handlebars.compile(htmlTemplate);
  const htmlContent = template(data);

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  const pdfPath = `./uploads/pedido-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  return pdfPath;
};

// Rota para gerar e enviar um e-mail com PDF
app.post("/send-email", upload.none(), async (req, res) => {
  try {
    const emailData = req.body;

    if (
      !emailData ||
      !emailData.cpf ||
      !emailData.description ||
      !emailData.rows ||
      emailData.rows.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos." });
    }

    // Gerar o PDF com Puppeteer
    const pdfPath = await generatePdfWithPuppeteer(emailData);

    // Configuração do transporte de e-mail (Gmail)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // Gmail
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Senha de aplicativo do Gmail
      },
    });

    const timestamp = Date.now();
    const pdfFilename = `pedido-${timestamp}.pdf`;

    const mailOptions = {
      from: process.env.EMAIL_FROM, // E-mail do remetente
      to: process.env.EMAIL_TO, // E-mail do destinatário
      subject: `Novo Pedido - Cliente ${emailData.client}`,
      text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
      attachments: [
        {
          filename: pdfFilename,
          path: pdfPath,
        },
      ],
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso");

    // Deletar o PDF após o envio
    fs.unlinkSync(pdfPath);

    res.json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar e-mail." });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
