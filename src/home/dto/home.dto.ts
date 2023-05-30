import { PropertyType } from "@prisma/client";
import { Exclude, Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

export class HomeResponseDto {
  id: number;
  address: string;
  numOfBedrooms: number;
  numOfBathrooms: number;
  city: string;
  listedDate: Date;
  price: number;
  landSize: number;
  propertyType: PropertyType;

  image: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
  
  @Exclude()
  realtorId: number

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial)
  }
}

export interface GetHomesParam {
  city: string;
  minPrice: string;
  maxPrice: string;
  propertyType: PropertyType
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numOfBathrooms: number;
  
  @IsString()
  @IsNotEmpty()
  city: string;
  
  @IsNumber()
  @IsPositive()
  price: number
  
  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Image)
  images: Image[]
}

export class UpdateHomeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numOfBedrooms?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numOfBathrooms?: number;
  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  landSize?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType; 
}