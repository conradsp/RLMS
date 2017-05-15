'use strict';

const nodemailer = require('nodemailer');

export default function(app) {

// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'rlmszw.com',
    port: 465,
    auth: {
      user: 'admin@rlmszw.com',
      pass: 'Slime99!'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  app.post('/email', function (req, res) {
    var statusCode = 200;
    transporter.sendMail({
      from: 'RLMS Admin <admin@rlmszw.com>',
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.message
    }, (err, info) => {
      res.sendStatus(200);
    });
  });
}




