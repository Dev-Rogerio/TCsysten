const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente do .env
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Permite requisições do front-end

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Configure no .env
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Desabilita o erro de "SSL certificate" (caso ocorra)
  },
});

app.post("/send-email", async (req, res) => {
  const emailData = req.body;

  if (
    !emailData.cpf ||
    !emailData.colar ||
    !emailData.pala ||
    !emailData.manga
  ) {
    return res
      .status(400)
      .json({ message: "Campos obrigatórios estão ausentes." });
  }

  // Criando o documento PDF
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", async () => {
    const pdfData = Buffer.concat(buffers);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "roger.ngt3494@gmail.com",
      subject: `Cliente / Pedido por CPF: ${emailData.cpf}`,
      text: "Segue em anexo os dados do pedido.",
      attachments: [
        {
          filename: `Pedido-${emailData.cpf}.pdf`,
          content: pdfData, // Anexa o PDF no e-mail
          contentType: "application/pdf",
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ E-mail enviado com sucesso:", info.response);
      res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
      res
        .status(500)
        .json({ message: "Erro ao enviar e-mail.", error: error.message });
    }
  });

  // Adicionando conteúdo ao PDF

  doc
    .fontSize(16)
    .text("Dados do Pedido Cotovia", { align: "center" })
    .moveDown();
  doc.fontSize(12).text(`CPF: ${emailData.cpf}`);
  doc.text(`Vendedor: ${emailData.vendedor}`);
  doc.text(`Data do Pedido: ${emailData.inputDate}`);
  doc.text(`Data da Entrega: ${emailData.deliveryDate}`);
  doc.text(`Colar: ${emailData.colar}`);
  doc.text(`Pala: ${emailData.pala}`);
  doc.text(`Manga: ${emailData.manga}`);
  doc.text(`Torax: ${emailData.torax}`);
  doc.text(`Cintura: ${emailData.cintura}`);
  doc.text(`Quadril: ${emailData.quadril}`);
  doc.text(`Comprimento: ${emailData.cumprimento}`);
  doc.text(`Bíceps: ${emailData.biceps}`);
  doc.text(`Antebraço: ${emailData.antebraco}`);
  doc.text(`Punho Esq.: ${emailData.punhoEsquerdo}`);
  doc.text(`Punho Dir.: ${emailData.punhoDireito}`);
  doc.text(`Extra Rigido: ${emailData.extraRigido}`);
  doc.text(`Barbatana: ${emailData.barbatana}`);
  doc.text(`Monograma: ${emailData.monograma}`);
  doc.text(`Modelo: ${emailData.typeModel}`);
  doc.text(`Pense: ${emailData.typePense}`);
  doc.text(`Mensagem: ${emailData.description}`);

  doc.end();
});

// 🚀 Ouvindo a porta
app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3000}`)
);
