require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer"); // Adiciona puppeteer
const cors = require("cors");

// Configuração do CORS para permitir requisições de qualquer origem
// const corsOptions = {
//   origin: "*", // Permite requisições de qualquer origem
//   methods: ["GET", "POST", "PUT", "DELETE"], // Permite os métodos necessários
// };
const app = express();
const port = process.env.PORT || 5000;

// Configuração do CORS para permitir requisições de origens específicas
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

// Função para gerar PDF a partir de dados e template HTML usando Puppeteer
const generatePdfWithPuppeteer = async (data) => {
  const browser = await puppeteer.launch({
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

// Rota para gerar e enviar um e-mail com PDF
app.post("/send-email", upload.none(), async (req, res) => {
  console.log("Requisição recebida:", req.body); // Verifique se o corpo da requisição está chegando
  try {
    const emailData = req.body;

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

    // Gerar o PDF com Puppeteer
    const pdfPath = await generatePdfWithPuppeteer(emailData); // Gera o PDF com Puppeteer
    console.log("PDF Gerado em:", pdfPath);

    // Configuração do transporter para envio de e-mail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Definição das opções do e-mail

    const timestamp = Date.now();
    const pdfFilename = `pedido-${timestamp}.pdf`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ["roger.ngt3494@gmail.com", "adriana.kamisaria@gmail.com"],
      subject: `Novo Pedido - Cliente ${emailData.client}`,
      text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
      attachments: [
        {
          filename: pdfFilename, // Nome único para o PDF
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
