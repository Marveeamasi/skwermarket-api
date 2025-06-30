import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().min(1),
  role: z.enum(['vendor', 'customer']),
  title: z.string().optional(),
  about: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  country: z.string().min(1).optional(),
  title: z.string().optional(),
  about: z.string().optional(),
  colors: z
    .object({
      primary: z.string(),
      accent: z.string(),
      secondary: z.string(),
      topBarTextCol: z.string(),
      topBarBgCol: z.string(),
      bodyBgCol: z.string(),
      bodyTextCol: z.string(),
    })
    .optional(),
  fonts: z
    .object({
      title: z.string(),
      heading: z.string(),
      body: z.string(),
      action: z.string(),
    })
    .optional(),
});

export const updateManyUsersSchema = z.object({
  ids: z.array(z.string()),
  updateData: updateUserSchema,
});