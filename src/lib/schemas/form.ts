import { z } from 'zod';

export const loginSchema = z.object({
  roleId: z
    .string()
    .regex(/^\d+$/, { message: 'Game ID must only contain digits' })
    .min(5, { message: 'Game ID must be at least 5 characters long' })
    .max(15, { message: 'Game ID must be at most 15 characters long' }),
  zoneId: z
    .string()
    .regex(/^\d+$/, { message: 'Server ID must only contain digits' })
    .min(3, { message: 'Server ID must be at least 3 characters long' })
    .max(6, { message: 'Server ID must be at most 6 characters long' })
});

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, { message: 'OTP must only contain digits' })
    .min(4, { message: 'OTP must be at least 4 characters long' })
    .max(4, { message: 'OTP must be at most 4 characters long' })
});

export type LoginSchema = typeof loginSchema;
export type OTPSchema = typeof otpSchema;
