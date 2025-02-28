const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const { name, email, subject, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: `New Message from ${name}: ${subject}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error sending email' }),
    };
  }
};