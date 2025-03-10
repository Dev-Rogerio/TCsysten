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

// Configuração do CORS para permitir requisições de origens específicas
const corsOptions = {
  origin: ["https://tcsysten.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuração do Multer para upload de arquivos (caso precise)
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
  });
  const page = await browser.newPage();

  // Caminho do template HTML
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

  // Substituir placeholders com os dados
  const htmlContent = template(data);

  // Verifique o HTML gerado (para depuração)
  console.log("HTML gerado:", htmlContent);

  // Carregar o conteúdo HTML na página
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  // Gerar o PDF com as configurações necessárias
  const pdfPath = `./uploads/pedido-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();

  return pdfPath;
};

// Rota inicial para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor funcionando corretamente!");
});

// Rota para gerar e enviar e-mail com PDF
// app.post("/send-email", upload.none(), async (req, res) => {
//   console.log("Requisição recebida:", req.body);

//   try {
//     const emailData = req.body;

//     // Validação dos dados de entrada
//     if (!emailData || !emailData.cpf || !emailData.description) {
//       console.log("Dados inválidos recebidos:", emailData);
//       return res
//         .status(400)
//         .json({ success: false, message: "Dados inválidos." });
//     }

//     if (!emailData.rows || emailData.rows.length === 0) {
//       console.log("O campo 'rows' está vazio ou não foi preenchido.");
//       return res
//         .status(400)
//         .json({ success: false, message: "O campo 'rows' é obrigatório." });
//     }

//     // Gerar PDF com Puppeteer
//     const pdfPath = await generatePdfWithPuppeteer(emailData); // Gera o PDF com Puppeteer
//     console.log("PDF Gerado em:", pdfPath);

//     // Configuração do transporter para envio de e-mail
//     // const transporter = nodemailer.createTransport({
//     //   service: process.env.EMAIL_SERVICE, // 'gmail' ou outro serviço configurado
//     //   auth: {
//     //     user: process.env.EMAIL_USER, // Seu e-mail
//     //     pass: process.env.EMAIL_PASS, // Sua senha ou token
//     //   },
//     // });

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // use TLS
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Definir as opções do e-mail
//     const timestamp = Date.now();
//     const pdfFilename = `pedido-${timestamp}.pdf`;

//     const mailOptions = {
//       from: process.env.EMAIL_FROM, // Remetente
//       to: process.env.EMAIL_TO, // Destinatário
//       subject: `Novo Pedido - Cliente ${emailData.client}`,
//       text: `Pedido do cliente ${emailData.cpf} realizado com sucesso.`,
//       attachments: [
//         {
//           filename: pdfFilename, // Nome do PDF
//           path: pdfPath, // Caminho do PDF gerado
//         },
//       ],
//     };

//     // Enviar o e-mail com o PDF anexado
//     await transporter.sendMail(mailOptions);
//     console.log("E-mail enviado com sucesso para:", mailOptions.to);

//     // Deletar o PDF após o envio
//     fs.unlinkSync(pdfPath);

//     res.json({ success: true, message: "E-mail enviado com sucesso!" });
//   } catch (error) {
//     console.error("Erro ao enviar e-mail:", error);
//     res.status(500).json({ success: false, message: "Erro ao enviar e-mail." });
//   }
// });

app.post("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Teste de Envio de E-mail",
      text: "Este é um e-mail de teste para verificar se o envio está funcionando.",
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "E-mail de teste enviado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de teste:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao enviar e-mail de teste." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
