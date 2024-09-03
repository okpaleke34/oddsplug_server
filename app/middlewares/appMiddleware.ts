import { verifyDayToken, genDayToken, JWT_SECRET } from './../utils/helpers'; 
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
// import { Op } from "sequelize";
// import dotenv from 'dotenv'
import { createToken,formatUnix } from "../utils/helpers";
// import StaffService from "../services/services.staff";
// import { IPrivilege } from "../interfaces/IPrivilege";
// import StudentService from "../services/services.student";
// import { LoginRepository } from "../infrastructure/PostgreSQL/repository/login.repository";

import 'dotenv/config';
// dotenv.config();
interface JwtPayloadWithAuth extends jwt.JwtPayload {
    auth: {
        userID: string;
        role: string;
    };
}
interface JwtPayloadWithDayToken extends jwt.JwtPayload {
    dayToken: string;
}

export const authSchool = (req: Request,res: Response, next: NextFunction) =>{
    // let MYSGWAuth = req.headers['x-authorization'];
    // MYSGWAuth = MYSGWAuth?.toString()
    // // Verify and extract the JWT token
    // const jwtToken = MYSGWAuth ? MYSGWAuth.split(' ')[1] : null;
    // if(!jwtToken){
    //     return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    // }
    // else{       
    //     jwt.verify(jwtToken,process.env.JWT_SECRET,async(err,decodedToken)=>{
    //         if(err){
    //             console.log({err});
    //             return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //         }
    //         else{
    //             const { schoolID, userID, role } = decodedToken.auth;
    //             try{
    //                 const schoolService = new SchoolService()
    //                 const school = await schoolService.fetchSchoolDetails({mysgwid:schoolID})
    //                 res.locals.school = school
    //                 next()
    //             }
    //             catch(err){
    //                 console.log({err})
    //                 return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //             }
    //         }
    //     })
    // }
    
}




export const authStaff = (req: Request,res: Response, next: NextFunction) =>{
    // let auth = req.headers['x-authorization'];
    // auth = auth?.toString()

    // // Verify and extract the JWT token
    // const jwtToken = auth ? auth.split(' ')[1] : null;
    
    // if(!jwtToken){
    //     return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    // }
    // else{
    //     const JWTSecret = process.env.JWT_SECRET
    //     if(!JWTSecret){
    //         return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //     }
    //     jwt.verify(jwtToken,JWTSecret,async(err,decodedToken)=>{
    //         if(err){
    //             console.log({err});
    //             return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //         }
    //         else{
    //             if(!decodedToken){
    //                 return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //             }
    //             const typedDecodedToken = decodedToken as JwtPayloadWithAuth;
        
    //             const { userID, role } = typedDecodedToken.auth;
    //             // const { userID, role } = decodedToken.auth;
    //             if(role !== "staff"){
    //                 return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //             }
    //             try{
    //                 const staffService = new StaffService()
    //                 const staff = await staffService.staffDetails({id: userID})
    //                 res.locals.staff = staff
    //                 next()
    //             }
    //             catch(err:any){
    //                 console.log({err})
    //                 return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    //             }
    //         }
    //     })
    // }
    
}
  

const validateDayToken = (dayToken:string) =>{
    try{
        const JWTSecret = process.env.JWT_SECRET
        if(!JWTSecret){
            throw new Error("JWT Secret is not set")
        }
        const decoded = jwt.verify(dayToken,JWTSecret)
        const typedDecodedToken = decoded as JwtPayloadWithDayToken;
        const verifiedDayToken:any = verifyDayToken(typedDecodedToken.dayToken)
        if(verifiedDayToken.isNew){
            verifiedDayToken.token = createToken("dayToken",{id:verifiedDayToken.id,timestamp:verifiedDayToken.timestamp})
        }
        return verifiedDayToken
    }
    catch(err){
        console.log({err})
        const newDayToken:any = verifyDayToken(null)
        newDayToken.token = createToken("dayToken",{id:newDayToken.id,timestamp:newDayToken.timestamp})
        return newDayToken
    }
}

export const authStudent = (req: Request,res: Response, next: NextFunction) =>{
//     let auth = req.headers['x-authorization'];
//     auth = auth?.toString()
//     let dayToken = req.headers['day-token'];
//     dayToken = dayToken?.toString();
//     if(dayToken){
//         dayToken = validateDayToken(dayToken);
//         // console.log("validateDayToken", dayToken)
//     }
//     else{
//         // Generate a new day token
//         const newDayToken:any = verifyDayToken(null)
//         newDayToken.token = createToken("dayToken",{id:newDayToken.id,timestamp:newDayToken.timestamp})
//         dayToken = newDayToken
//         // console.log("newDayToken", dayToken)
//     }

//     // Verify and extract the JWT token
//     const jwtToken = auth ? auth.split(' ')[1] : null;
    
//     if(!jwtToken){
//         return res.status(401).json({status:false,data:{message:"1. You are not authorized to make this request, or visit this page"}})
//     }
//     else{
        
//         const JWTSecret = process.env.JWT_SECRET
//         if(!JWTSecret){
//             return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
//         }
//         jwt.verify(jwtToken,JWTSecret,async(err,decodedToken)=>{
//             if(err){
//                 console.log({err});
//                 console.log({jwtToken,JWTSecret})
//                 return res.status(401).json({status:false,data:{message:"2. You are not authorized to make this request, or visit this page"}})
//             }
//             else{
//                 if(!decodedToken){
//                     return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
//                 }
//                 const typedDecodedToken = decodedToken as JwtPayloadWithAuth;
        
//                 const { userID, role } = typedDecodedToken.auth;
//                 if(role !== "student"){
//                     return res.status(401).json({status:false,data:{message:"3. You are not authorized to make this request, or visit this page"}})
//                 }
//                 try{
//                     const studentService = new StudentService()
//                     const student:any = await studentService.studentDetails({id: userID})
//                     student.dayToken = dayToken
//                     res.locals.student = student
//                     next() 
//                 }
//                 catch(err){
//                     console.log({err})
//                     return res.status(401).json({status:false,data:{message:"4. You are not authorized to make this request, or visit this page"}})
//                 }
//             }
//         })
//     }    
}








module.exports.settings = async (req,res, next) =>{
    next()
}


module.exports.helpers = async (req,res,next)=>{
    res.locals.formatUnix = formatUnix
    next()
}

