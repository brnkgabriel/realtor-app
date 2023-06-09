import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, GetHomesParam, HomeResponseDto, InquireDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from '../user/decorators/user.decorator';
import { iUser } from '../user/decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService
  ) { }
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType
  ): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes({
      city, maxPrice, minPrice, propertyType
    })
  }

  @Get(':id')
  getHome(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.homeService.getHomeById(id)
  }

  @Roles(UserType.REALTOR) 
  @Post()
  createHome(
    @Body() body: CreateHomeDto,
    @User() user: iUser
  ) {
    return this.homeService.createHome(body, user.id)
  }


  @Roles(UserType.REALTOR) 
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: iUser
  ) {
    const isAuthorized = await this.homeService.isAuthorized(id, user.id) 
    if (isAuthorized) {
      return this.homeService.updateHome(id, body)
    }
    throw new UnauthorizedException()
  }

  @Roles(UserType.REALTOR) 
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: iUser
  ) {
    const isAuthorized = await this.homeService.isAuthorized(id, user.id) 
    if (isAuthorized) {
      return this.homeService.deleteHome(id)
    }
    throw new UnauthorizedException()
  }
 
  @Roles(UserType.BUYER)
  @Post('/:id/inquire/')
  inquireAbout(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: iUser,
    @Body() { message }: InquireDto
  ) {
    return this.homeService.inquire(user, homeId, message)
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: iUser,
  ) {
    const isAuthorized = await this.homeService.isAuthorized(homeId, user.id)

    if (isAuthorized) {
      return this.homeService.getMessagesByHome(homeId)
    }
    throw new UnauthorizedException()
  }

}
