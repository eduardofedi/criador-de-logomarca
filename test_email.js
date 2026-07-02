const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contato@criadordelogomarca.com.br',
    pass: 'Cr1ad0r@Logo#26',
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: '"Test" <contato@criadordelogomarca.com.br>',
      to: 'edufedi98@hotmail.com',
      subject: 'Test email from Criador de Logomarca',
      text: 'This is a test to verify SMTP credentials.',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

main();
