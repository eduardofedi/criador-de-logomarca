import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contato@criadordelogomarca.com.br',
    pass: 'Cr1ad0r@Logo#26',
  },
});

export async function sendLogoEmail(to: string, logoData: string) {
  let filename = 'logotipo.svg';
  let contentType = 'image/svg+xml';
  let attachmentContent: string | Buffer = logoData;

  // Verifica se o conteúdo é uma tag HTML img com base64 (gerado pela OpenAI)
  const srcMatch = logoData.match(/src="data:image\/png;base64,([^"]+)"/);
  if (srcMatch && srcMatch[1]) {
    attachmentContent = Buffer.from(srcMatch[1], 'base64');
    filename = 'Logotipo_Premium.png';
    contentType = 'image/png';
  }

  const mailOptions = {
    from: '"Criador de Logomarca" <contato@criadordelogomarca.com.br>',
    to,
    subject: 'O seu logotipo exclusivo chegou! 🎉',
    text: 'Olá! Agradecemos pela sua compra. Seu logotipo está em anexo em alta resolução.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Seu logotipo está pronto!</h2>
        <p>Olá! Agradecemos imensamente pela sua compra.</p>
        <p>Em anexo, você encontrará o arquivo <strong>de alta resolução (.png)</strong> do seu logotipo, pronto para uso.</p>
        <p>Se tiver qualquer dúvida, basta responder a este e-mail.</p>
        <br/>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Criador de Logomarca</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: filename,
        content: attachmentContent,
        contentType: contentType,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
