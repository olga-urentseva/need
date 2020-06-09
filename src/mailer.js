const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      debug: true,
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  send(to, subject, text) {
    const emailMessage = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };
    this.transport.sendMail(emailMessage, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
}

module.exports = new Mailer();
