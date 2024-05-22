import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ValidationDto {
  @IsNumber()
  @IsNotEmpty()
  public habitId: number

  @IsNumber()
  public counter: number

  @IsNumber()
  public difficulty: number

  @IsString()
  public message: string
}
