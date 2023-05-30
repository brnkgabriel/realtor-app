import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, GetHomesParam, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { iUser } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

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
  @UseGuards(AuthGuard)
  @Post()
  createHome(
    @Body() body: CreateHomeDto,
    @User() user: iUser
  ) {
    return 'created home'
    // return this.homeService.createHome(body, user.id)
  }

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

}
