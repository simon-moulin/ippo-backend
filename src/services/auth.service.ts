import { Service } from 'typedi'
import { User } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import { HttpException } from '../exceptions/http.exception'
import { SignupDto, LoginDto } from '../dtos/auth.dtos'
import { prismaClient } from '@/prisma/prisma'

import Stripe from 'stripe'
const stripeClient = new Stripe(process.env.STRIPE_KEY!)
export const SECRET_KEY: Secret = 'monsupersecretjwt'

@Service()
export class AuthService {
  public users = prismaClient.user

  public async signup(toCreate: SignupDto): Promise<User> {
    const findUser = await this.users.findUnique({
      where: { email: toCreate.email },
    })
    if (findUser != null) throw new HttpException(409, `This email ${toCreate.email} already exists`)

    if (toCreate.password != toCreate.confirmPassword) {
      throw new HttpException(401, "Passwords doesn't match")
    }

    // Salt password
    const hashed = await hash(toCreate.password, 12)

    // Create the user
    let newUser = await this.users.create({
      data: {
        email: toCreate.email,
        username: toCreate.username,
        password: hashed,
      },
    })

    if (!newUser) {
      throw new HttpException(500, 'Error while creating the user')
    }

    const stripeUser = await stripeClient.customers.create({
      name: toCreate.username,
      email: toCreate.email,
    })

    newUser = await this.users.update({
      where: { id: newUser.id },

      data: {
        stripeId: stripeUser.id,
      },
    })

    return newUser
  }

  public async login(userLogin: LoginDto): Promise<User> {
    const user = await this.users.findFirst({
      where: { OR: [{ email: userLogin.email }, { username: userLogin.username }] },
    })

    if (!user) {
      throw new HttpException(401, 'Invalid credentials')
    }

    const validPassword = await compare(userLogin.password, user.password)

    if (!validPassword) {
      throw new HttpException(401, 'Invalid credentials')
    }
    user.password = ''

    if (user.stripeId == null) {
      const stripeUser = await stripeClient.customers.create({
        name: user.username,
        email: user.email,
      })

      await this.users.update({
        where: { id: user.id },

        data: {
          stripeId: stripeUser.id,
        },
      })
    }
    return user
  }

  public async generateToken(user: User): Promise<string> {
    return jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: 36000,
    })
  }
}
