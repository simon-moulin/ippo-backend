import { AccountService } from '@/services/account.service'
import { getLogger } from '@/utils/logger.service'
import { MailService } from '@/services/mail.service'
import { Response, NextFunction, Request } from 'express'
import Stripe from 'stripe'
import Container from 'typedi'

const stripeClient = new Stripe(process.env.STRIPE_KEY!)
const endpointSecret =
  process.env.ENDPOINT_SIGNATURE || 'whsec_6ce12ab6604358c1245465733b21bcf15436a4f7901661bd293593faf1fcb7cf'

export class StripeController {
  public accountService = Container.get(AccountService)

  public logger = getLogger()

  public mailService = Container.get(MailService)

  public webhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'] as string

      let event: Stripe.Event

      try {
        event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret)
      } catch (err) {
        this.logger.error(JSON.stringify(err))
        res.status(400).send(`Webhook Error: ${(err as Error).message}`)
        return
      }

      if (event.type == 'customer.subscription.deleted') {
        this.accountService.setSubscription(event.data.object.customer as string, false)
      }
      if (event.type == 'checkout.session.completed') {
        this.accountService.setSubscription(event.data.object.customer as string, true)
        const user = await this.accountService.getUserByStripeId(event.data.object.customer as string)
        this.mailService.sendSubscriptionEmail(user!, await this.accountService.getManagerSubLink(user!.stripeId!))
      }

      if (event.type == 'invoice.payment_failed') {
        this.accountService.setSubscription(event.data.object.customer as string, false)
      }
      // Return a 200 response to acknowledge receipt of the event
      res.send()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      next(error)
    }
  }
}
