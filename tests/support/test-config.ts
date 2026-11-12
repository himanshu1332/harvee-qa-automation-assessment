import dotenv from 'dotenv';

dotenv.config();

/** Central configuration for the practice application and published test users. */
export const testConfig = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  standardUser: process.env.STANDARD_USER ?? 'standard_user',
  lockedUser: process.env.LOCKED_USER ?? 'locked_out_user',
  password: process.env.PASSWORD ?? 'secret_sauce'
} as const;
