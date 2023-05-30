import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone must be a valid phone number" })
  phone: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(5)
  password: string

  @IsEnum(UserType)
  userType: UserType

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productKey?: string
}


export class SigninDto {
  @IsEmail()
  email: string;
  
  @IsString()
  password: string
}

export class ProductKeyDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userType: UserType;
}