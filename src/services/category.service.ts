import { Service } from 'typedi'
import { Category } from '@prisma/client'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class CategoryService {
  public categories = prismaClient.category

  public getAll(): Promise<Category[]> {
    return this.categories.findMany()
  }
}
