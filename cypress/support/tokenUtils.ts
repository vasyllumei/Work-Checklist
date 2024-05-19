export function generateMockToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      sub: 'admin@test.com',
    }),
  );
  const signature = 'fake-signature';
  return `${header}.${payload}.${signature}`;
}
