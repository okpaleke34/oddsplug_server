"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("./mongodb");
// import { PostgreSQL } from './postgresql';
const config_1 = __importDefault(require("../utils/config"));
let dbInstance;
if (config_1.default.db.type === 'mongodb') {
    dbInstance = new mongodb_1.MongoDB();
}
// else if (config.db.type === 'postgresql') {
//   dbInstance = new PostgreSQL();
// }
else {
    throw new Error('Unsupported DB_TYPE');
}
exports.default = dbInstance;
