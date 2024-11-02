import 'reflect-metadata'
import { App } from './app'
import { AuthRoute } from './routes/auth.route'
import { HabitRoute } from './routes/habit.route'
import { FollowRoute } from './routes/follow.route'
import { ValidationRoute } from './routes/validation.route'
import { AccountRoute } from './routes/account.route'
import { FeedRoute } from './routes/feed.route'
import dotenv from 'dotenv'
import { StripeRoute } from './routes/stripe.route'

dotenv.config({ path: '.env.dev' })

const app = new App([
  new AuthRoute(),
  new HabitRoute(),
  new FollowRoute(),
  new ValidationRoute(),
  new AccountRoute(),
  new FeedRoute(),
  new StripeRoute(),
])

app.listen()
