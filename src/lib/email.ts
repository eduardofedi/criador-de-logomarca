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

export async function sendLogoEmail(to: string, logoSvg: string) {
  const mailOptions = {
    from: '"Criador de Logomarca" <contato@criadordelogomarca.com.br>',
    to,
    subject: 'O seu logotipo exclusivo chegou! 🎉',
    text: 'Olá! Agradecemos pela sua compra. Seu logotipo está em anexo. Para usar como imagem transparente, salve o arquivo SVG e converta se necessário, ou abra no navegador e salve.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Seu logotipo está pronto!</h2>
        <p>Olá! Agradecemos imensamente pela sua compra.</p>
        <p>Em anexo, você encontrará o arquivo <strong>vetorial (.svg)</strong> do seu logotipo, que garante qualidade infinita sem perder resolução.</p>
        <p>Se tiver qualquer dúvida, basta responder a este e-mail.</p>
        <br/>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Criador de Logomarca</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: 'logotipo.svg',
        content: logoSvg,
        contentType: 'image/svg+xml',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
