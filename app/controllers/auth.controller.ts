import { useragent } from 'express-useragent';
import jwt from "jsonwebtoken";
// import { auth } from '@/auth';
import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import fs from "fs"
import { createUserAgent, generateAccessToken, generateRefreshToken,genID,ourBookmakers,ourSports,randomInt, sendMail } from '../utils/helpers';
import bcrypt from 'bcryptjs';
import UserService from "../services/user.service";
import webpush from "web-push";
import logger from '../utils/logger';
import { INotificationSubscription } from "../utils/types.d";
import { AuthRequest } from '../types/express.d';
import { IAuth } from '../infrastructure/mongodb/models/auth.model';
import UserSettingService from '../services/user-setting.service';
import mongoose from 'mongoose';

const vapidKeys = {
  publicKey: "BINnDbAF1fHoOnUet_W3jb9lULG-gsH0HkTI1MC2-cFaeSNjsyVSAnNWdgZpqGxoVSMXQAwVSikKjtTM1UVj41s",
  privateKey: "LvmB0MUy0LwAWC6PtlheltaNde2s-T_OpRpRRfE7Aok",
};

// webpush.setVapidDetails()
webpush.setVapidDetails(
  "mailto:okpaleke34.pl@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// webpush.setVapidDetails(
//   "mailto:okpaleke34.pl@gmail.com",
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// )

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const authService = new AuthService();

    // Check if the user already exists
    const auths = await authService.getAuth({ email });
    if(auths.length > 0){
      res.status(400).json({status:false, message: "User already exists" });
      return;
    }

    // Create a new user using the email and hashed password
    const username = email.split('@')[0]+Math.floor(Math.random()*100000);//Generate a random username
    const userAgent = createUserAgent(req)
    const auth = await authService.createAuth({ email, password:hashedPassword,role:"user", username,devices:[userAgent] });
    const user = {id: auth._id as string, email: auth.email as string, role: auth.role, username: auth.username, sec: auth.password as string }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // console.log({auth})
    // console.log({user})
    // Update the JWT in the database
    const updateAuth = await authService.updateAuth({email}, {JWT:refreshToken});
    if(!updateAuth){
      res.status(400).json({status:false, message: "Failed to update JWT" });
      return;
    }

    // Create a user account
    const userService = new UserService();

    const authId = new mongoose.Types.ObjectId(auth._id as string);
    const userAccount = await userService.createUser({authId});
    if(!userAccount){
      res.status(400).json({status:false, message: "Failed to create user account" });
      return;
    }
    // Create user settings
    const bookmakers = ourBookmakers.map(b => b.name)
    const sports = ourSports.map(s => s.name)
    const userSettingService = new UserSettingService()
    const userSettingAccount = await userSettingService.createUserSetting({authId,arbitrageAlert:2,bookmakers,sports,timezone:"Africa/Lagos",oddType:"decimal",clonedBookmakers:[{parent:"_1xbet",bookmaker:"_1xbet",customURL:"https://ng.1x001.com"}]});
    if(!userSettingAccount){
      res.status(400).json({status:false, message: "Failed to create user settings" });
      return;
    }

    const newUser = {...user} as any
    newUser.authId = newUser.id
    delete newUser.id
    delete newUser.sec
    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV !== "development" });
    res.json({ status:true, accessToken, refreshToken, user:newUser });
  }
  catch (error:any) {
    res.status(400).json({status:false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {

    const authService = new AuthService();
    const auths = await authService.getAuth({ email });
    if(!auths || auths.length == 0){
      res.status(400).json({status:false, message: "User does not exist" });
      return;
    }
    if(auths.length > 1){
      res.status(400).json({status:false, message: "Multiple users with same email" });
      return;
    }
    const auth = auths[0];
    if(auth.isOAuth){
      // Because users authenticated via third party OAuth can't login with password
      res.status(400).json({status:false, message: "User authenticated via third party OAuth" });
      return;
    }
    try {
      if (await bcrypt.compare(password, auth.password as string)) {
        const user = {id: auth._id as string, email: auth.email as string, role: auth.role, username: auth.username, sec: auth.password as string }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Check for devices
        const userAgent = createUserAgent(req)
        if ('devices' in auth) {
          let updated = false
          const devices = auth.devices?.map(device=>{
            if(device.status == 1){
              device.status = 0
            }
            if(device.useragent == userAgent.useragent || device.ip == userAgent.ip){
              device.status = 1
              device.lastLogin = new Date()
              updated = true
            }
            return device
          })
          // update the devices or append new one
          if(updated)
            auth.devices = devices
          else
            auth.devices?.push(userAgent)
        }
        else{
          auth.devices = [userAgent]
        }
        const updateAuth = await authService.updateAuth({email}, {devices:auth.devices});
        const newUser = {...user} as any
        newUser.authId = newUser.id
        delete newUser.id
        delete newUser.sec
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV !== "development" });
        res.json({ status:true, accessToken, refreshToken, user:newUser });
      }
      else {
        res.json({status:false, message: 'Invalid credentials'});
      }
    } 
    catch(error:any) {
      logger.error(`Error logging in: ${error}`)   
      res.json({status:false, message: `Error logging in: ${error.message}`});
    }
  }
  catch (error:any) {
    logger.error(`Error logging in: ${error}`)
    res.json({status:false, message: error.message });
  }
};

const resetPasswordFunction = async (auth: IAuth, res: Response) => {
  if(auth.isOAuth){
    // Because users authenticated via third party OAuth can't reset password
    res.json({status:false, message: "User authenticated via third party OAuth" });
  }
  try {
    const newPassword = genID(10)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const authService = new AuthService();
    const updateAuth = await authService.updateAuth({_id:auth._id}, {password:hashedPassword});
    if(updateAuth){
      const subject = "Oddsplug: Password Reset"
      const message = `Dear ${auth.username}, <br/><br/> Your password has been reset to: ${newPassword}<br/>Thanks`
      let contents = fs.readFileSync('./app/data/mail.html').toString()
      contents = contents.replace(/==mail-title==/gi,"Password Reset")
      const html = contents.replace(/==mail-body==/gi,message)
      sendMail({subject,html,to:auth.email,callback:function(error, info){
        if (error) {
          logger.error(`Error resetting password: ${error}`);
          res.json({status:false,message:'Password reset successful but mail not sent'})
        }
      }})
      res.json({status:true,message:'New password has been sent to your email address successfully'})
    }
    else{
      res.json({status:false, message: `Error resetting password`})
    }
  } 
  catch(error:any) {
    logger.error(`Error resetting password: ${error}`)
    res.json({status:false, message: `Error resetting password: ${error.message}`})
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {

    const authService = new AuthService();
    let auths = await authService.getAuth({ username:user });
    if(!auths || auths.length == 0){
      auths = await authService.getAuth({ email:user });
      if(!auths || auths.length == 0){
        res.status(400).json({status:false, message: "User does not exist" });
        return;
      }
      else{
        resetPasswordFunction(auths[0],res)
      }
    }
    else{
      resetPasswordFunction(auths[0],res)
    }
    
  }
  catch (error:any) {
    logger.error(`Error logging in: ${error}`)
    res.json({status:false, message: error.message });
  }
};

// Token refresh route
export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log("Access token refreshed",{refreshToken},req.cookies)
  if (!refreshToken) return res.status(200).json({status:false, message: "No refresh token" });
  // console.log({refreshToken})
  // console.log(process.env.REFRESH_TOKEN_SECRET!)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
    if (err) return res.status(200).json({status:false, message: "Invalid refresh token" });
    // TODO: Randomly check if the JWTtoken and password is the same in the database (check if the device is active, check if refreshToken is same)
    delete user.iat
    const accessToken = generateAccessToken(user);
    user.authId = user.id
    delete user.id
    delete user.sec
    res.status(200).json({status:true, accessToken, user });
  });
};

export const sendNotification= async (req: Request, res: Response)=>{
  try{

    const aggregate = [
      { $unwind: '$devices' }, // Deconstruct devices array to filter individual documents
      { 
        $match: {
          'devices.status': 1, 
          'devices.notificationSubscription': { $ne: null } 
        } 
      },
      { 
        $project: { 
          _id: 1, 
          'devices.notificationSubscription': 1 ,
          // 'email': 1 
        } 
      }
    ]
    const authService = new AuthService()
    const usersSubscription = await authService.getAggregate(aggregate);
    if(usersSubscription.length == 0)
    {
      res.status(201).json({status:true, message: "No user found to send the notification"});
      return 
    }
    // TODO: run query to search all the _id in the table and only return _id that has arbitrageAlert up to that level
    // then use map to match all the that are available, then return the filtered users with the specific subscription


    const subscriptions = usersSubscription.map(doc => {
      if(doc.devices !== undefined){ 
        const devices: any = doc.devices
        return devices.notificationSubscription
      }
    });
    // console.log(subscriptions)
    
    const notificationPayload = {
        title: "New Notification",
        body: "This is a new notification",
        icon: "https://oddsplug.com/public/icon-192x192.png",
        data: {
          url: "https://oddsplug.com",
        },
    };
    // res.status(200).json({ message: "Notification sent successfully."+randomInt(1,1000) })
    // return

    Promise.all(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      )

    //   webpush.sendNotification(subscriptions[0], JSON.stringify(notificationPayload))
    )
    .then(() => res.status(200).json({ message: "Notification sent successfully." }))
    .catch((error) => {
      logger.error(`Error sending notification: ${error}`);
      res.status(500).json({status:false, message: `Failed to send notification: ${error}`});
    });

  }
  catch(error){
    logger.error(`Error sending notification : ${error}`)
    res.status(201).json({status:false, message: `Failed to send notification: ${error}`});
  }
}

// ================= AUTHENTICATED ROUTES ================= 
export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const auth = req.auth
        // Check for devices
        const userAgent = createUserAgent(req)
        if ('devices' in auth) {
          let updated = false
          const devices = auth.devices?.map(device=>{
            // set the status of the device to 0
            if(device.useragent == userAgent.useragent || device.ip == userAgent.ip){
              device.status = 0
              updated = true
            }
            return device
          })
          // update the devices or append new one
          if(updated)
            auth.devices = devices
          else
            auth.devices?.push(userAgent)
        }
        else{
          auth.devices = [userAgent]
        }
        const authService = new AuthService();
        const updateAuth = await authService.updateAuth({_id:auth.id}, {devices:auth.devices,JWT:""});
        // console.log({updateAuth})
        res.json({ status:true, message:"logged out successfully" });      
    } 
    catch(error:any) {
      logger.error(`Error logging out: ${error}`)   
      res.json({status:false, message: `Error logging in: ${error.message}`});
    }
};


export const subscribe2Notification = async (req: AuthRequest, res: Response)=>{
  
  const subscription = req.body.subscription as INotificationSubscription
  const { arbitrageAlert } = req.body
  try{
    const auth = req.auth
    const authService = new AuthService();
    // Check for devices
    const userAgent = createUserAgent(req)
    if ('devices' in auth) {
      let updated = false
      const devices = auth.devices?.map(device=>{
        // update the notification of the device
        if(device.useragent == userAgent.useragent || device.ip == userAgent.ip){
          device.notificationSubscription = subscription
          updated = true
        }
        return device
      })
      // update the devices or append new one
      if(updated)
        auth.devices = devices
      else
        auth.devices?.push(userAgent)
    }
    else{
      userAgent.notificationSubscription = subscription
      auth.devices = [userAgent]
    }

    const updateAuth = await authService.updateAuth({_id:auth.id}, {devices:auth.devices});

    // Update the  user setting
    const userSettingService = new UserSettingService()
    const updateUserSett = await userSettingService.updateUserSetting({authId:auth.id},{arbitrageAlert:parseFloat(arbitrageAlert)})


    res.status(200).json({status: true, message:"successfully updated the arbitrage alert"});
  }
  catch(error){
    logger.error(`Error saving subscription : ${error}`)
    res.status(201).json({status:false, message: "Failed to update the arbitrage alert"});
  }
}
