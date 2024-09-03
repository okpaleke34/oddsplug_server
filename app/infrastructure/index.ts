import { IDatabase } from './IDatabase';
import { MongoDB } from './mongodb';
// import { PostgreSQL } from './postgresql';
import 'dotenv/config';

let dbInstance: IDatabase;
if (process.env.DB_TYPE === 'mongodb') {
  dbInstance = new MongoDB();
}
// else if (process.env.DB_TYPE === 'postgresql') {
//   dbInstance = new PostgreSQL();
// }
else {
  throw new Error('Unsupported DB_TYPE');
}

export default dbInstance;