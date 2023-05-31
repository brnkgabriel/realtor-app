import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";

// works only in development
// import * as jwt from 'jsonwebtoken';

// works only in production
import jwt from 'jsonwebtoken'

export class UserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    handler: CallHandler
  ):Promise<any> {
    const request = context.switchToHttp().getRequest()
    const token = request?.headers?.authorization?.split("Bearer ")[1]
    const user = await jwt.decode(token) 
    request.user = user
    return handler.handle()
  }
}