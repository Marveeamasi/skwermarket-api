import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../types/user';
import { sendOTP, sendPasswordResetOTP, generateOTP } from '../utils/email';
import { registerSchema, loginSchema, verifyOTPSchema, resetPasswordSchema } from '../utils/validation';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const { email, password, country, role, title, about } = data;

    // Check if email exists
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user: User = {
      id: `user${Date.now()}`,
      email,
      password: hashedPassword,
      country,
      role,
      title: role === 'vendor' ? title || 'New Brand' : undefined,
      banner: role === 'vendor' ? { type: 'image', url: '/card-banner.jpg' } : undefined,
      colors: role === 'vendor' ? { primary: '#4F7942', accent: '#ffae00', secondary: '#888888', topBarTextCol: '', topBarBgCol: '', bodyBgCol: '', bodyTextCol: '' } : undefined,
      fonts: role === 'vendor' ? { title: 'poppins', heading: 'poppins', body: 'poppins', action: 'poppins' } : undefined,
      about: role === 'vendor' ? about || 'New brand description' : undefined,
      loyalists: [],
      offers: [],
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      otp,
      otp_expires: otpExpires.toISOString(),
      email_verified: false,
    };

    // Insert user into Supabase
    const { error } = await supabase.from('users').insert([user]);
    if (error) {
      res.status(500).json({ error: 'Failed to register user' });
      return;
    }

    // Send OTP
    await sendOTP(email, otp);

    res.status(201).json({ message: 'User registered. Please verify your email with the OTP sent.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user || error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (user.otp !== otp || !user.otp_expires || new Date(user.otp_expires) < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({ email_verified: true, otp: null, otp_expires: null })
      .eq('email', email);
    if (updateError) {
      res.status(500).json({ error: 'Failed to verify email' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.status(200).json({ message: 'Email verified', token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user || error) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    if (!user.email_verified) {
      res.status(401).json({ error: 'Please verify your email first' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const { data: user, error } = await supabase.from('users').select('id').eq('email', email).single();
    if (!user || error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const { error: updateError } = await supabase
      .from('users')
      .update({ otp, otp_expires: otpExpires.toISOString() })
      .eq('email', email);
    if (updateError) {
      res.status(500).json({ error: 'Failed to generate OTP' });
      return;
    }

    await sendPasswordResetOTP(email, otp);
    res.status(200).json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user || error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (user.otp !== otp || !user.otp_expires || new Date(user.otp_expires) < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword, otp: null, otp_expires: null })
      .eq('email', email);
    if (updateError) {
      res.status(500).json({ error: 'Failed to reset password' });
      return;
    }

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};