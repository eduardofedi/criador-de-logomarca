const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, logos(svg_content)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  console.log('Latest order:', order.id, 'Email:', order.email);
  
  let logoData = null;
  if (Array.isArray(order.logos)) {
    logoData = order.logos[0]?.svg_content;
  } else {
    logoData = order.logos?.svg_content;
  }
  
  if (!logoData) {
    console.log('No logo data found!');
    return;
  }

  console.log('Logo data found. Attempting to send email...');

  let filename = 'logotipo.svg';
  let contentType = 'image/svg+xml';
  let attachmentContent = logoData;

  const srcMatch = logoData.match(/src="data:image\/png;base64,([^"]+)"/);
  if (srcMatch && srcMatch[1]) {
    attachmentContent = Buffer.from(srcMatch[1], 'base64');
    filename = 'Logotipo_Premium.png';
    contentType = 'image/png';
    console.log('Base64 image extracted successfully.');
  }

  const mailOptions = {
    from: '"Criador de Logomarca" <contato@criadordelogomarca.com.br>',
    to: order.email, // Send to the actual user email from the order
    subject: 'O seu logotipo exclusivo chegou! 🎉 (TESTE FINAL)',
    text: 'Olá! Agradecemos pela sua compra. Seu logotipo está em anexo em alta resolução.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Seu logotipo está pronto!</h2>
        <p>Olá! Agradecemos imensamente pela sua compra.</p>
        <p>Em anexo, você encontrará o arquivo <strong>de alta resolução (.png)</strong> do seu logotipo, pronto para uso.</p>
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('SMTP error:', err);
  }
}

main();
