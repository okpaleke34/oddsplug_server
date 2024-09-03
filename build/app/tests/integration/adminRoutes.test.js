"use strict";
// import request from 'supertest';
// import app from '../../../app';
// import db from '../../infrastructure';
// import { MongoAdminRepository } from '../../infrastructure/mongodb/repositories/admin.repository';
// // Mock data for the test
// const mockAdmins = [
//   { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
//   { id: 2, name: 'Admin 2', email: 'admin2@example.com' }
// ];
// // Mock the database connection and disconnection methods
// jest.spyOn(db, 'connect').mockImplementation(async () => Promise.resolve());
// jest.spyOn(db, 'disconnect').mockImplementation(async () => Promise.resolve());
// // Mock the fetchAdmins method in the MongoAdminRepository
// jest.spyOn(MongoAdminRepository.prototype, 'fetchAdmins').mockImplementation(async () => mockAdmins);
// describe('Admin Routes', () => {
//   beforeAll(async () => {
//     await db.connect();
//   });
//   afterAll(async () => {
//     await db.disconnect();
//   });
//   it('should fetch all admins', async () => {
//     // const response = await request(app).get('/api/admins');
//     const response = await request(app).get('/v1/bet/fetch-arbitrages');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockAdmins);
//   });
// });
