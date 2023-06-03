import { PropertyType } from "@prisma/client"
import { CreateHomeDto } from "src/home/dto/home.dto"

export const mockHomes = [
  {
    "id": 1,
    "address": "2345 William Str",
    "city": "Toronto",
    "price": 1500000,
    "propertyType": "RESIDENTIAL",
    "numOfBathrooms": 2.5,
    "numOfBedrooms": 3
  },
  {
    "id": 8,
    "address": "5514, Griggs Rd, off Old Spanish Trail",
    "city": "Houston",
    "price": 50000,
    "propertyType": "RESIDENTIAL",
    "numOfBathrooms": 3,
    "numOfBedrooms": 4,
    "images": [
      "https://cdn.realtor.ca/listing/TS638210323169500000/reb114/highres/4/40425534_1.jpg"
    ]
  },
  {
    "id": 9,
    "address": "280 Rue",
    "city": "Quebec",
    "price": 269000,
    "propertyType": "CONDO",
    "numOfBathrooms": 3,
    "numOfBedrooms": 4,
    "images": [
      "https://cdn.realtor.ca/listing/TS638210323391800000/reb5/highres/8/26774898_1.jpg"
    ]
  },
  {
    "id": 10,
    "address": "280 Rue Sauvageau",
    "city": "Quebec",
    "price": 269000,
    "propertyType": "CONDO",
    "numOfBathrooms": 3,
    "numOfBedrooms": 4,
    "images": [
      "https://cdn.realtor.ca/listing/TS638210323391800000/reb5/highres/8/26774898_1.jpg"
    ]
  }
]

export const mockHome = {
  "id": 10,
  "address": "280 Rue Sauvageau",
  "city": "Quebec",
  "price": 269000,
  "propertyType": "CONDO",
  "numOfBathrooms": 3,
  "numOfBedrooms": 4,
  "image": "https://cdn.realtor.ca/listing/TS638210323391800000/reb5/highres/8/26774898_1.jpg"
}

export const mockImages = [
  {
    id: 1,
    url: "src1"
  },
  {
    id: 2,
    url: "src2"
  }
]

export const mockCreateHomeParams: CreateHomeDto = {
  address: "111 Yellow Str",
  city: "Vancouver",
  images: [
    { url: "https://cdn.realtor.ca/listing/TS638210323391800000/reb5/highres/8/26774898_1.jpg" }
  ],
  landSize: 4444,
  numOfBathrooms: 2,
  numOfBedrooms: 2,
  price: 300000,
  propertyType: PropertyType.RESIDENTIAL 
}