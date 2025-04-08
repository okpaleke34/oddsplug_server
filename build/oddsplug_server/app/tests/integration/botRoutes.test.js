"use strict";
// import request from 'supertest';
// import app from '../../app';
// import db from '../../infrastructure';
// describe('Bot Routes', () => {
//   beforeAll(async () => {
//     await db.connect();
//   });
//   afterAll(async () => {
//     await db.disconnect();
//   });
//   it('should create an arbitrage', async () => {
//     const arbitrageData = {
//       tournament: 'Tournament A',
//       market_code: 'ft_dnb',
//       arb: '4.23',
//       arb_id: 'unique_arb_id',
//       match_id: 'unique_match_id',
//       hash: 'unique_hash',
//       scrap_id: 'unique_scrap_id',
//       sports: 'Football',
//       game_type: 'Prematch',
//       bookmakers: [{ bookmaker: 'bet9ja', teams: 'Arsenal vs Chelsea', market: 'ov', odd: 2.3, odds: [2.3, 1.5] }],
//       scanned_at: '2024-07-14T00:00:00Z',
//       start_at: '2024-07-15T00:00:00Z',
//       updated_at: '2024-07-14T00:00:00Z',
//       status: 1
//     };
//     const response = await request(app).post('/api/arbitrages').send(arbitrageData);
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('_id');
//     expect(response.body.tournament).toBe(arbitrageData.tournament);
//   });
//   // Add more integration tests as needed
// });
