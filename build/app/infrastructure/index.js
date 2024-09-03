"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("./mongodb");
// import { PostgreSQL } from './postgresql';
require("dotenv/config");
let dbInstance;
if (process.env.DB_TYPE === 'mongodb') {
    dbInstance = new mongodb_1.MongoDB();
}
// else if (process.env.DB_TYPE === 'postgresql') {
//   dbInstance = new PostgreSQL();
// }
else {
    throw new Error('Unsupported DB_TYPE');
}
exports.default = dbInstance;
