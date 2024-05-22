import { Frequency } from '@prisma/client'
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsNumber } from 'class-validator'

export class HabitRequestDto {
  @IsString()
  @IsNotEmpty()
  public name: string

  @IsString()
  @IsNotEmpty()
  public categoryName: string

  @IsBoolean()
  @IsNotEmpty()
  public visibility: boolean

  @IsEnum(Frequency)
  @IsNotEmpty()
  public frequency: Frequency

  @IsNumber()
  @IsNotEmpty()
  public occurency: number
}
