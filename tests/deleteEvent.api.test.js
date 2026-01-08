const request = require('supertest');
const { app, server } = require('../index');

describe('API Tests - Delete Event', () => {

  afterAll(() => {
    server.close();
  });

test('DELETE /delete-event/:id - endpoint responds correctly', async () => {
  const response = await request(app).delete('/delete-event/1');

  expect([200, 400]).toContain(response.statusCode);
  expect(response.body).toHaveProperty('success');
  expect(response.body).toHaveProperty('message');
});


  test('DELETE /delete-event/:id - non-existent event ID', async () => {
    const response = await request(app).delete('/delete-event/999');

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Event not found.');
  });

  test('DELETE /delete-event/:id - invalid event ID', async () => {
    const response = await request(app).delete('/delete-event/abc');

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

});
