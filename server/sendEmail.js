const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
require("dotenv").config(); // Carrega as variáveis de ambiente do .env

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendEmail(req, res) {
  const emailData = req.body;

  // Verificação de campos obrigatórios
  const { cpf, colar, pala, manga } = emailData;
  if (!cpf || !colar || !pala || !manga) {
    return res
      .status(400)
      .json({ message: "Campos obrigatórios estão ausentes." });
  }

  // Criando um PDF na memória
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", async () => {
    const pdfData = Buffer.concat(buffers);

    console.log("📄 PDF gerado, tamanho do arquivo:", pdfData.length);

    // Configuração do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "roger.ngt3494@gmail.com",
      subject: `Cliente / Pedido por CPF: ${cpf}`,
      text: "Segue em anexo os dados do pedido.",
      attachments: [
        {
          filename: `Pedido-${cpf}.pdf`,
          content: pdfData, // Envia o Buffer diretamente
        },
      ],
    };

    console.log("📧 Enviando e-mail para:", mailOptions.to);

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ E-mail enviado com sucesso:", info.response);
      res
        .status(200)
        .json({ message: "E-mail enviado com sucesso!", to: mailOptions.to });
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
      res.status(500).json({
        message: "Erro ao enviar e-mail.",
        error: error.message,
      });
    }
  });

  // Adiciona os dados ao PDF
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

  // Finaliza a criação do PDF
  doc.end();
};
