export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey'
};
export const COOKIE_NAME = process.env.COOKIE_NAME || 'AUTH_TOKEN';