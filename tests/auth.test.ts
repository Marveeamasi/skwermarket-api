import request from 'supertest';
import app from '../src/app';
import { supabase } from '../src/utils/supabase';
import { generateOTP } from '../src/utils/email';

jest.mock('../src/utils/email', () => ({
  sendOTP: jest.fn(),
  generateOTP: jest.fn(() => generateOTP),
}));

describe('Auth Routes', () => {
  beforeEach(async () => {
    await supabase.from('users').delete().neq('id', '0');
  });

  test('POST /api/auth/register should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        country: 'US',
        role: 'customer',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered. Please verify your email with the OTP sent.');
  });

  test('POST /api/auth/login should login a verified user', async () => {
    await supabase.from('users').insert([
      { 
        email: 'test@example.com',
        password: await (require('bcrypt')).hash('password123', 10),
        country: 'US',
        role: 'customer',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});