import { Injectable, NotFoundException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeDto, GetHomesParam, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { iUser } from 'src/user/decorators/user.decorator';

export const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  numOfBathrooms: true,
  numOfBedrooms: true,
  images: {
    select: {
      url: true
    },
    take: 1
  }
}

@Injectable()
export class HomeService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {

    const { city, maxPrice, minPrice, propertyType } = filter

    const homes = await this.prismaService.home.findMany({
      select: homeSelect,
      where: {
        city: {
          endsWith: city || '',
          mode: 'insensitive'
        },
        price: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) })
        },
        ...(propertyType && { propertyType })
      }
    })

    if (!homes.length) {
      throw new NotFoundException()
    }
    return homes.map(home => {
      const fetchHome = { ...home, image: home?.images[0]?.url }
      delete fetchHome.images
      return new HomeResponseDto(fetchHome)
    })
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id
      }
    })

    if (!home) {
      throw new NotFoundException()
    }

    return new HomeResponseDto(home)
  }

  async createHome(body: CreateHomeDto, id: number) {
    const {
      address,
      city,
      images,
      landSize,
      numOfBathrooms,
      numOfBedrooms,
      price,
      propertyType
    } = body
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        landSize,
        numOfBathrooms,
        numOfBedrooms,
        price,
        propertyType,
        created_at: new Date(),
        listedDate: new Date(),
        updated_at: new Date(),
        realtorId: id,
      }
    })

    const homeImages = images.map(image => {
      return { url: image.url, homeId: home.id }
    })

    await this.prismaService.image.createMany({ data: homeImages })

    return new HomeResponseDto(home)
  }

  async updateHome(homeId: number, data: UpdateHomeDto) {
    const home = await this.prismaService.home.findUnique({
      where: { id: homeId }
    })

    if (!home) throw new NotFoundException()

    const updatedHome = await this.prismaService.home.update({
      where: { id: homeId }, data
    })

    return new HomeResponseDto(updatedHome)
  }

  async deleteHome(homeId: number) {
    try {
      await this.prismaService.image.deleteMany({
        where: { homeId }
      })
      await this.prismaService.home.delete({
        where: { id: homeId }
      })
      return { message: "home successfully deleted" }
    } catch (error: any) {
      throw new NotImplementedException(`couldn't delete record because ${error.message}`)
    }
  }

  async isAuthorized(homeId: number, userId: number) {
    const realtor = await this.getRealtorByHomeId(homeId) 
    console.log("realtor id", realtor.id, "userId", userId)
    return realtor.id === userId
  }
 
  async getRealtorByHomeId(id: number) {

    const where = { id }
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!home) {
      throw new NotFoundException()
    }

    return home.realtor
  }

  async inquire(buyer: iUser, homeId: number, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId)
    return await this.prismaService.message.create({
      data: {
        realtorId: realtor.id,
        buyerId: buyer.id,
        homeId,
        message
      }
    })
  }

  async getMessagesByHome(homeId: number) {
    const messages = await this.prismaService.message.findMany({
      where: { homeId },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })
    return messages
  }
}
