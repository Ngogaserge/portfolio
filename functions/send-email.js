const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Check if the request body is empty
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Request body is empty' }),
    };
  }

  // Parse the JSON data
  let formData;
  try {
    formData = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON data' }),
    };
  }

  const { name, email, subject, message } = formData;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  // Create a transporter using environment variables
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // Your email from environment variables
      pass: process.env.EMAIL_PASSWORD, // Your email password from environment variables
    },
  });

  const mailOptions = {
    from: email, // Sender's email (from the form)
    to: process.env.EMAIL, // Your email (to receive the message)
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