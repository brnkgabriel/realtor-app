import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { User, UserType } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async tokenize(id: number, name: string) {
    return await jwt.sign(
      { name, id },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 86400 }
    )
  }

  async signup(body: SignupDto) {
    const { email, password, name, phone, userType } = body

    if (userType !== UserType.BUYER) {
      this.signupAsRealtorOrAdmin(body)
    }

    const userExists = await this.prismaService
      .user.findUnique({
        where: { email }
      })

    if (userExists) {
      throw new ConflictException('The credential conflicts with an existing user')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        userType
      }
    })

    return this.tokenize(user.id, name)
  }

  async signupAsRealtorOrAdmin(body: SignupDto) {
    const { userType } = body
    if (!body.productKey) {
      throw new UnauthorizedException()
    }

    const validProductKey = this.keyStr(body.email, userType)

    const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey)

    console.log("is key valid", isValidProductKey)

    if (!isValidProductKey) {
      throw new UnauthorizedException()
    }
  }

  async signin(body: SigninDto) {
    const { email, password } = body
    const user = await this.prismaService.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new HttpException('Invalid credentials', 400)
    }

    const hashedPassword = user.password
    const isValidPassword = await bcrypt.compare(password, hashedPassword)

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400)
    }
    return this.tokenize(user.id, user.name)
  }

  generateProductKey(user: ProductKeyDto) {
    const str = this.keyStr(user.email, user.userType)

    return bcrypt.hash(str, 10)
  }

  keyStr(email: string, type: UserType) {
    return `${email}-${type}-${process.env.PRODUCT_KEY_SECRET}`
  }
}
