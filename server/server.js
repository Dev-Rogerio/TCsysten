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

// Configuração do CORS para permitir requisições de qualquer origem
const corsOptions = {
  origin: ["https://tcsysten.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

// Função para gerar PDF a partir de dados e template HTML usando Puppeteer
const generatePdfWithPuppeteer = async (data) => {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000,
  }); // Lançar o Puppeteer em modo headless com timeout aumentado
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

  // Verifique o HTML gerado
  console.log("HTML gerado:", htmlContent);

  // Carregar o conteúdo HTML na página
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  // Gerar o PDF com as configurações necessárias
  const pdfPath = `./uploads/pedido-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  return pdfPath;
};

// Adicionar uma rota GET na raiz do servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando corretamente!");
});

// Rota para gerar e enviar um e-mail com PDF
app.post("/send-email", upload.none(), async (req, res) => {
  console.log("Requisição recebida:", req.body); // Verifique se o corpo da requisição está chegando
  try {
    const emailData = req.body;
    console.log("Dados recebidos:", emailData);
    console.log(emailData.rows);

    // Validação dos dados de entrada
    if (!emailData || !emailData.cpf || !emailData.description) {
      console.log("Dados inválidos recebidos:", emailData); // Verifique os dados recebidos
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos." });
    }
    // Adicionando validação para o campo 'rows'
    if (!emailData.rows || emailData.rows.length === 0) {
      console.log("O campo 'rows' está vazio ou não foi preenchido.");
      return res
        .status(400)
        .json({ success: false, message: "O campo 'rows' é obrigatório." });
    }

    console.log("Dados recebidos: ", emailData.rows);
    console.log("Gerando PDF...");

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

    transporter.verify((error, success) => {
      if (error) {
        console.error("Erro na configuração do Nodemailer:", error);
      } else {
        console.log("Servidor de e-mail pronto para enviar mensagens.");
      }
    });

    // Definição das opções do e-mail

    const timestamp = Date.now();
    const pdfFilename = `pedido-${timestamp}.pdf`;

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Remetente
      to: process.env.EMAIL_TO, // Destinatário
      subject: `Novo Pedido - Cliente ${emailData.client}`,
      text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
      attachments: [
        {
          filename: `pedido-${Date.now()}.pdf`, // Nome do PDF
          path: pdfPath, // Caminho do PDF gerado
        },
      ],
    };

    console.log("Enviando e-mail...");

    // Enviar o e-mail com o PDF anexado
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso para:", mailOptions.to);

    // Deletar o PDF após o envio
    fs.unlinkSync(pdfPath);

    res.json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar e-mail.",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
