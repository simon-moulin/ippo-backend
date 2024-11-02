import { Service } from 'typedi'
import nodemailer from 'nodemailer'
import pug from 'pug'
import { User } from '@prisma/client'
import { getLogger } from './logger.service'

@Service()
export class MailService {
  private transporter: nodemailer.Transporter
  private logger = getLogger()
  constructor() {
    this.createConnection()
  }

  //CREATE A CONNECTION FOR LIVE
  private async createConnection() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      auth: {
        user: process.env.SMTP_USER as string | undefined,
        pass: process.env.SMTP_PASSWORD as string | undefined,
      },
    })
  }

  public sendLoginEmail(user: User, ip: string) {
    const compiledFunction = pug.compileFile('src/templates/newLogin.pug')
    this.getTransporter().sendMail(
      {
        to: user.email,
        from: "L'équipe Ippo<contact@simonmoulin.fr>",
        subject: 'Nouvelle connexion à votre compte',
        html: compiledFunction({
          date: `${new Date().toLocaleDateString('fr')} ${new Date().toLocaleTimeString('fr')}`,
          ip: ip,
        }),
      },
      (error, info) => {
        if (error) {
          this.logger.error(error)
        } else {
          this.logger.info('Email sent: ' + info.response)
        }
      }
    )
  }

  public sendSubscriptionEmail(user: User, link: string) {
    const compiledFunction = pug.compileFile('src/templates/subscribe.pug')
    this.getTransporter().sendMail(
      {
        to: user.email,
        from: "L'équipe Ippo<contact@simonmoulin.fr>",
        subject: "Souscription à l'abonnement Premium",
        html: compiledFunction({
          link: link,
        }),
      },
      (error, info) => {
        if (error) {
          this.logger.error(error)
        } else {
          this.logger.info('Email sent: ' + info.response)
        }
      }
    )
  }

  public getTransporter() {
    return this.transporter
  }
}
