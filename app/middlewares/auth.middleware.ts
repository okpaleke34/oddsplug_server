import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import Auth from '../models/authModel';

// dotenv.config();

import 'dotenv/config';
import AuthService from '../services/auth.service';
import logger from '../utils/logger';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//       req.user = await Auth.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
};


// export const botAuth = (req: Request,res: Response, next: NextFunction) =>{
export const botAuth = (req,res, next) =>{
    const {robot} = req.cookies
    if(robot == "2+Aq0fr=^1GT*9B{=C£QXt-9wJm|NGY$j2"){
        res.locals.bot = true
        next()
    }
    else{
        res.status(404).json({message:"Not authenticated"});
    }
}

export const authenticateUserToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, user) => {
      if (err){
        // console.log({err})
        if(err.name == "TokenExpiredError")
            return res.status(403).json({status:false,message:"Token Expired, Log in again"});
        else
            return res.status(403).json({status:false,message:err.message});
      }
      const { email, id } = user.user
        try {
            const authService = new AuthService();
            const auths = await authService.getAuth({ _id:id });
            if(!auths || auths.length == 0){
                res.status(400).json({status:false, message: "User does not exist" });
            }
            req.auth = auths[0];
            next();
        }  
        catch (error:any) {
            logger.error(`Error logging out: ${error}`)
            res.json({status:false, message: error.message });
        }
    });
  };