const nodemailer = require('nodemailer');
const Email = require('../models/Email');

const sendBulkEmails = async (req, res) => {
  const { subject, body, recipients } = req.body;

  if (!subject || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Please provide subject, body, and a list of recipients.' });
  }

  try {
    // Generate a test ethereal account if no real credentials are provided
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Use ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log('Using Ethereal Mail Credentials', testAccount.user);
    }

    // Using BCC to hide recipients from each other in a bulk send
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Bulk Mailer" <admin@example.com>',
      bcc: recipients.join(','),
      subject: subject,
      text: body,
      html: `<div style="font-family: sans-serif; color: #333;">
               ${body.split('\n').map(line => `<p>${line}</p>`).join('')}
             </div>`, 
    });

    console.log("Message sent: %s", info.messageId);

    // If using ethereal, you can get a preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if(previewUrl) console.log("Preview URL: %s", previewUrl);

    // Save record to MongoDB
    const emailRecord = new Email({
      subject,
      body,
      recipients,
      status: 'Success',
      errorLogs: previewUrl ? `Ethereal Preview URL: ${previewUrl}` : null
    });

    await emailRecord.save();

    res.status(200).json({ message: 'Emails sent successfully', record: emailRecord });
  } catch (error) {
    console.error('Error sending emails:', error);

    const emailRecord = new Email({
      subject,
      body,
      recipients,
      status: 'Failed',
      errorLogs: error.message
    });
    // Attempt to save failed record
    try {
      await emailRecord.save();
    } catch(dbErr) {
      console.error('Error saving failed record:', dbErr);
    }

    res.status(500).json({ error: 'Failed to send emails', details: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Email.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = {
  sendBulkEmails,
  getHistory
};
