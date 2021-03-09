const nodemailer = require("nodemailer");
const DotEnv = require("dotenv");
DotEnv.config();

var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

class NodeMailer {
  constructor() {}

  send(to, subject, generateTextFromHtml, token) {
    let html = `<div class="text" style="padding: 0 2.5em; text-align: center;"><h2>Please verify your email</h2><h3>Amazing deals, updates, interesting news right in your inbox</h3><p><a href="${process.env.NODE_SERVER_HOST}/token/${token}" class="btn btn-primary" target="_blank">click here</a></p></div>`;

    return new Promise((resolve, reject) => {
      var mailOption = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        generateTextFromHtml: generateTextFromHtml,
        html: html,
      };

      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  }
}

module.exports = new NodeMailer();
