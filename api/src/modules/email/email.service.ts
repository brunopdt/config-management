/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

@Injectable()
export class EmailService {
  sendMail = (email: string, code: string) => {
    const mailOptions = {
      from: 'process.env.EMAIL_USER',
      to: `${email}`,
      subject: 'Código de recuperação de senha',
      text: `Seu codigo de redefinição de senha é: ${code}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  sendEventMail = (email: string, eventName: string, placeName) => {
    const mailOptions = {
      from: 'process.env.EMAIL_USER',
      to: `${email}`,
      subject: 'Aninha do FindUai',
      text: 'Animado para o evento?',
      html: `<div>
          <h2>${placeName} está chamando você para curtir!</h2>
          <p>Acesse o FindUai para mais informações sobre o novo evento <b>${eventName}</b></p>
      </div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}