// types/express.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    // user?: {
    //   id: string;
    //   // Add other user properties here
    // };
    auth?: any;
  }
}


export interface AuthRequest extends Request {
  // user?: {
  //   id: string;
  //   // Add other user properties here
  // };
  auth?: any;
}