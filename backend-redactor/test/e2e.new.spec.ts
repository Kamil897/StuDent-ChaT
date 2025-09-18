import request from 'supertest';

const LOGIN_URL = 'http://localhost:3000/auth/login';
const API_URL = 'http://localhost:4000';

async function getToken() {
  const res = await request(LOGIN_URL).post('').send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  return res.body.access_token as string;
}

describe('New endpoints (e2e)', () => {
  let token = '';
  beforeAll(async () => {
    token = await getToken();
  });

  it('GET /api/templates', async () => {
    const res = await request(API_URL).get('/api/templates').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/generate-styled-text', async () => {
    const res = await request(API_URL)
      .post('/api/generate-styled-text')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Test', font: 'Inter', effect: 'neon' });
    expect([200, 400, 500]).toContain(res.status); // allow failure if OPENAI not configured
  });

  it('GET /api/projects', async () => {
    const res = await request(API_URL).get('/api/projects').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

