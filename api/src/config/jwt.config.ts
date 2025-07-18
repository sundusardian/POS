import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRATION || '1d',
}));
