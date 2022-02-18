import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import config from '../config';
import handlebars from 'handlebars';
import * as fs from 'fs';
import * as mjml from 'mjml';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transport;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secureConnection: config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
  }

  sendMail = async (params: SendMailParams) => {
    try {
      await this.transporter.sendMail({
        from: `"SoWeQuiches" <${config.mail.from}>`,
        to: params.to,
        subject: this.getSubject(params.template),
        html: this.getTemplate(params.template, params.data), // html body
      });
    } catch (e) {
      console.log(e);
    }
  };

  private getTemplate = (template: MailTemplate, data: Record<string, any>) => {
    const mjmlTemplate = fs.readFileSync(
      `${__dirname}/../../templates/${template}.template.mjml`,
      { encoding: 'utf-8' },
    );

    const formattedMjml = mjml(mjmlTemplate);

    return handlebars.compile(formattedMjml.html)(data);
  };

  private getSubject = (template: MailTemplate) => {
    switch (template) {
      case MailTemplate.registration:
        return 'Activation de compte - SoWeQuiches';
    }
  };
}

type SendMailParams = {
  to: string;
  template: MailTemplate;
  data?: Record<string, any>;
};

export enum MailTemplate {
  registration = 'registration',
}
