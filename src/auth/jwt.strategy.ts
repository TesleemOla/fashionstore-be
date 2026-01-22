import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { jwtConstants, COOKIE_NAME } from './constants';
import { Request } from 'express';

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[COOKIE_NAME];
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    // payload should contain user id and roles
    return done(null, payload);
  }
}