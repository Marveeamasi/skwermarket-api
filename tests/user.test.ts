import request from 'supertest';
import app from '../src/app'; // Adjusted to import from src/app.ts
import { supabase } from '../src/utils/supabase';
import jwt from 'jsonwebtoken';

describe('User Routes', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await supabase.from('users').delete().neq('id', '0');
    userId = 'user1';
    await supabase.from('users').insert([
      {
        id: userId,
        email: 'test@example.com',
        password: await (require('bcrypt')).hash('password123', 10),
        country: 'US',
        role: 'vendor',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    token = jwt.sign({ userId, role: 'vendor' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  });

  test('GET /api/users/:id should return user data', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  test('PUT /api/users/:id should update user data', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ country: 'UK' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User updated');
  });
});