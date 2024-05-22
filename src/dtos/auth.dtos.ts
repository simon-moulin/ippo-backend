import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class SignupDto {
  @IsEmail()
  public email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  public username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public confirmPassword: string
}

export class LoginDto {
  public email: string

  @IsString()
  @MinLength(5)
  @MaxLength(32)
  public username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string
}
