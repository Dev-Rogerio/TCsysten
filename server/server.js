require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer"); // Adiciona puppeteer
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Configuração do Multer para upload de arquivos
const upload = multer({ dest: "uploads/" });

// Criar diretório uploads se não existir
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Função para gerar PDF a partir de dados e template HTML usando Puppeteer
const generatePdfWithPuppeteer = async (data) => {
  const browser = await puppeteer.launch({ headless: true, timeout: 60000 }); // Lançar o Puppeteer em modo headless com timeout aumentado
  const page = await browser.newPage();

  // Verificar o caminho do template HTML
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

  // Carregar o template HTML
  const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
  const template = handlebars.compile(htmlTemplate);

  // Substituir os placeholders com os dados
  const htmlContent = template(data);

  // Carregar o conteúdo HTML na página
  await page.setContent(htmlContent);
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  // Gerar o PDF com as configurações necessárias
  const pdfPath = `./uploads/pedido-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  return pdfPath;
};

// Rota para gerar e enviar um e-mail com PDF
app.post("/send-email", upload.none(), async (req, res) => {
  try {
    const emailData = req.body;

    // Validação dos dados de entrada
    if (!emailData || !emailData.cpf || !emailData.description) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos." });
    }

    // Gerar o PDF com Puppeteer
    const pdfPath = await generatePdfWithPuppeteer(emailData); // Gera o PDF com Puppeteer
    console.log("PDF Gerado em:", pdfPath);

    // Configuração do transporter para envio de e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Definição das opções do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "roger.ngt3494@gmail.com", // ou adicione mais destinatários
      subject: `Novo Pedido - Cliente ${emailData.cpf}`,
      text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
      attachments: [
        {
          filename: `pedido-${Date.now()}.pdf`, // Nome único para o PDF
          path: pdfPath, // Caminho correto do PDF gerado
        },
      ],
    };

    // Enviar o e-mail com o PDF anexado
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso para:", mailOptions.to);

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
