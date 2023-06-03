import { Test, TestingModule } from "@nestjs/testing";
import { HomeService, homeSelect } from "./home.service"
import { PrismaService } from "src/prisma/prisma.service";
import { mockCreateHomeParams, mockHome, mockHomes, mockImages } from "test/mock";
import { PropertyType } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService, {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockHomes),
              create: jest.fn().mockReturnValue(mockHome)
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages)
            }
          }
        }
      ]
    }).compile()
    
    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService)
  })

  xdescribe('getHomes', () => {
    const filters = {
      city: "Toronto",
      maxPrice: "1500000",
      minPrice: "1000000",
      propertyType: PropertyType.RESIDENTIAL
    }
    xit('should call prisma findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockHomes)

      jest.spyOn(prismaService.home, "findMany").mockImplementation(mockPrismaFindManyHomes)
 
      await service.getHomes(filters)

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true
            },
            take: 1
          },
        },
        where: filters
      })
    })

    it('should throw not found exception if no homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([])

      jest
      .spyOn(prismaService.home, "findMany")
      .mockImplementation(mockPrismaFindManyHomes)

      await expect(service.getHomes(filters))
      .rejects
      .toThrowError(NotFoundException)
    })
  })

  describe('createMany', () => {
    it('should call prisma home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome)

      jest.spyOn(prismaService.home, "create")
      .mockImplementation(mockCreateHome)

      await service.createHome(mockCreateHomeParams, 5)
      
      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: "111 Yellow Str",
          city: "Vancouver",
          landSize: 4444,
          numOfBathrooms: 2,
          numOfBedrooms: 2,
          price: 300000,
          propertyType: PropertyType.RESIDENTIAL,
          realtorId: 5
        }
      })
    })
  })
})