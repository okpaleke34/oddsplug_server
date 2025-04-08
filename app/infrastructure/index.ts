import { IDatabase } from './IDatabase';
import { MongoDB } from './mongodb';
// import { PostgreSQL } from './postgresql';
import config from '../utils/config';

let dbInstance: IDatabase;
if (config.db.type === 'mongodb') {
  dbInstance = new MongoDB();
}
// else if (config.db.type === 'postgresql') {
//   dbInstance = new PostgreSQL();
// }
else {
  throw new Error('Unsupported DB_TYPE');
}

export default dbInstance;