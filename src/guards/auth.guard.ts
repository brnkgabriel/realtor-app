import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken'
import { PrismaService } from "../prisma/prisma.service";
import { iUser } from "../user/decorators/user.decorator";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    // 1) Determine the UserTypes that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass()
    ])

    console.log("roles", roles)
    if (roles?.length) {
      // 2) Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest()
      const token = request.headers?.authorization?.split("Bearer ")[1]
      try {
        const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as iUser
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id }
        })

        console.log("user", user)

        if (!user) return false
        if (roles.includes(user.userType)) return true

        return false
      } catch (error) {
        return false
      }
    }
    // 3) Database request to get user by id
    // 4) Determine if the user has permissions
    return false
  }
}