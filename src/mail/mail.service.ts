// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export type CartStatus = 'waiting' | 'active' | 'checked_out' | 'abandoned';

interface StatusMailContext {
  userName: string;
  orderRef: string;
  status: CartStatus;
  userEmail: string;
}

const STATUS_TEMPLATES: Record<
  CartStatus,
  { subject: string; html: (ctx: StatusMailContext) => string }
> = {
  waiting: {
    subject: 'Votre commande est en attente — HWstore',
    html: ({ userName, orderRef }) => `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Votre commande <strong>${orderRef}</strong> est actuellement <strong>en attente</strong> de traitement.</p>
      <p>Notre équipe va la prendre en charge très prochainement.</p>
      <br/><p>L'équipe HWstore</p>
    `,
  },
  active: {
    subject: 'Votre commande est en cours — HWstore',
    html: ({ userName, orderRef }) => `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Bonne nouvelle ! Votre commande <strong>${orderRef}</strong> est actuellement <strong>en cours de traitement</strong>.</p>
      <p>Nous préparons votre matériel avec soin.</p>
      <br/><p>L'équipe HWstore</p>
    `,
  },
  checked_out: {
    subject: 'Votre commande a été livrée — HWstore',
    html: ({ userName, orderRef }) => `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Votre commande <strong>${orderRef}</strong> a été <strong>livrée</strong> avec succès.</p>
      <p>Nous espérons que vous êtes satisfait(e) de votre achat. N'hésitez pas à nous contacter pour tout retour.</p>
      <br/><p>L'équipe HWstore</p>
    `,
  },
  abandoned: {
    subject: 'Votre commande a été annulée — HWstore',
    html: ({ userName, orderRef }) => `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Votre commande <strong>${orderRef}</strong> a été <strong>annulée</strong>.</p>
      <p>Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter à <a href="mailto:hwstoredz@hotmail.com">hwstoredz@hotmail.com</a>.</p>
      <br/><p>L'équipe HWstore</p>
    `,
  },
};

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendStatusUpdate(ctx: StatusMailContext): Promise<void> {
    const template = STATUS_TEMPLATES[ctx.status];
    if (!template) return;

    await this.mailer.sendMail({
      to: ctx.userEmail,
      subject: template.subject,
      html: template.html(ctx),
    });
  }
}
