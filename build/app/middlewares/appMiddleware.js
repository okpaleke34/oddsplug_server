"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authStudent = exports.authStaff = exports.authSchool = void 0;
const helpers_1 = require("./../utils/helpers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { Op } from "sequelize";
// import dotenv from 'dotenv'
const helpers_2 = require("../utils/helpers");
// import StaffService from "../services/services.staff";
// import { IPrivilege } from "../interfaces/IPrivilege";
// import StudentService from "../services/services.student";
// import { LoginRepository } from "../infrastructure/PostgreSQL/repository/login.repository";
require("dotenv/config");
const authSchool = (req, res, next) => {
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
};
exports.authSchool = authSchool;
const authStaff = (req, res, next) => {
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
};
exports.authStaff = authStaff;
const validateDayToken = (dayToken) => {
    try {
        const JWTSecret = process.env.JWT_SECRET;
        if (!JWTSecret) {
            throw new Error("JWT Secret is not set");
        }
        const decoded = jsonwebtoken_1.default.verify(dayToken, JWTSecret);
        const typedDecodedToken = decoded;
        const verifiedDayToken = (0, helpers_1.verifyDayToken)(typedDecodedToken.dayToken);
        if (verifiedDayToken.isNew) {
            verifiedDayToken.token = (0, helpers_2.createToken)("dayToken", { id: verifiedDayToken.id, timestamp: verifiedDayToken.timestamp });
        }
        return verifiedDayToken;
    }
    catch (err) {
        console.log({ err });
        const newDayToken = (0, helpers_1.verifyDayToken)(null);
        newDayToken.token = (0, helpers_2.createToken)("dayToken", { id: newDayToken.id, timestamp: newDayToken.timestamp });
        return newDayToken;
    }
};
const authStudent = (req, res, next) => {
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
};
exports.authStudent = authStudent;
module.exports.settings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next();
});
module.exports.helpers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.formatUnix = helpers_2.formatUnix;
    next();
});
