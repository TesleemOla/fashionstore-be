import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    // Add any custom logic here if needed
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn?.(context.switchToHttp().getRequest());
    return result;
  }
}