import { Request, Response } from 'express';
import SupportService from '../services/support.service';
import { cloneBookmakers, createUserAgent, generateAccessToken, generateRefreshToken, ourBookmakers, ourSports } from '../utils/helpers';
import logger from '../utils/logger';
import RecommendationService from '../services/recommendation.service';
import { AuthRequest } from '../types/express';
import mongoose from 'mongoose';
import RecommendationCommentService from '../services/recommendation-comment.service';
import UserBetService from '../services/user-bet.service';
import AuthService from '../services/authentication.service';
import bcrypt from 'bcryptjs';
import UserService from '../services/user-detail.service';
import UtilityService from '../services/utility.service';
import SubscriptionService from '../services/subscription.service';
import UserSettingService from '../services/user-setting.service';


export const getActivePlans = async (req: Request, res: Response) => {
  try {
    const subscriptionService = new SubscriptionService()
    const activePlans = await subscriptionService.getAllActivePlans()
    res.status(200).json({"status":true,data:activePlans});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const recommendationService = new RecommendationService()
    const recommendations = await recommendationService.getAllRecommendations()
    res.status(200).json({"status":true,data:recommendations});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const {recommendationId} = req.params;
    const recommendationService = new RecommendationService()
    const recommendations = await recommendationService.getRecommendation(recommendationId)

    const recommendationCommentService = new RecommendationCommentService()
    const comments = await recommendationCommentService.getRecommendationComments(recommendationId)

    res.status(200).json({"status":true,data:{...recommendations,comments}});
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const submitSupport = async (req: Request, res: Response) => {
  try {
    const {fullName,email,subject,message} = req.body;
    if(!fullName || !email || !subject || !message){
      return res.status(400).json({status:false, message: "All fields are required"});
    }
    const userAgent = createUserAgent(req)
    const supportService = new SupportService()
    const createSupport = await supportService.createSupport({fullName,email,subject,message,IPAddress:userAgent.ip})
    if(createSupport){
      res.status(200).json({"status":true,message:"We have received your message, our support team will process it and get back to you if needed"});      
    }
    else{
      res.status(200).json({"status":false, message:"Error: your message was not sent, try again or use other means of support to reach us out"});
    }

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}



// ====== Authenticated routes ======
export const submitRecommend = async (req: AuthRequest, res: Response) => {
  try {
    const {topic,description} = req.body;
    if(!topic || !description){
      return res.status(400).json({status:false, message: "All fields are required"});
    }
  
    const authId = req.auth?._id
    const recommendationService = new RecommendationService()
    const createRecommendation = await recommendationService.createRecommendation({topic,description,authId})
    if(createRecommendation){
      res.status(200).json({"status":true,message:"Recommendation submitted successfully",data:createRecommendation});      
    }
    else{
      res.status(200).json({"status":false, message:"Error: your recommendation was not sent, try again or use other means of support to reach us out"});
    }

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const submitRecommendationVote = async (req: AuthRequest, res: Response) => {
  try {
    const {isUp,id} = req.body;
    if(!id){
      return res.status(400).json({status:false, message: "All fields are required"});
    }
  
    const authId = req.auth?._id
    const recommendationService = new RecommendationService()
    const createRecommendation = await recommendationService.updateRecommendation({_id:new mongoose.Types.ObjectId(id)},{$push:{votes:{authId,isUp,date:new Date()}}})
    if(createRecommendation){
      res.status(200).json({"status":true,message:"Recommendation submitted successfully",data:createRecommendation});      
    }
    else{
      res.status(200).json({"status":false, message:"Error: your recommendation was not sent, try again or use other means of support to reach us out"});
    }

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const submitRecommendationComment = async (req: AuthRequest, res: Response) => {
  try {
    const {replyId,message,recommendationId} = req.body;
    if(!message){
      return res.status(400).json({status:false, message: "Message field is required"});
    }
  
    const authId = req.auth?._id
    const recommendationCommentService = new RecommendationCommentService()
    let createRecommendationComment;
    if(replyId){
      // createRecommendationComment = await recommendationCommentService.updateRecommendationComment({_id:new mongoose.Types.ObjectId(recommendationId)},{$push:{replies:{authId,message,date:new Date()}}})
      createRecommendationComment = await recommendationCommentService.updateRecommendationComment({_id:new mongoose.Types.ObjectId(replyId)},{$push:{replies:{authId,message,date:new Date(),status:1}}})

    }
    else{
      createRecommendationComment = await recommendationCommentService.createRecommendationComment({message,authId,recommendationId,status:1})
    }
    if(createRecommendationComment){
      res.status(200).json({"status":true,message:"Comment submitted successfully", data:createRecommendationComment});      
    }
    else{
      res.status(200).json({"status":false, message:"Error: your comment was not sent, try again or use other means of support to reach us out"});
    }

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const saveBet = async (req: AuthRequest, res: Response) => {
  try {
    const {betId,betType,calculatorValues,historyLength} = req.body;
    if(!betId){
      return res.status(400).json({status:false, message: "Bet ID is required"});
    }
  
    const authId = req.auth?._id
    const userBetService = new UserBetService()
    const createUserBet = await userBetService.createUserBet({authId,betId:new mongoose.Types.ObjectId(betId),betType,historyLength,calculatorValues})
    if(createUserBet){
      res.status(200).json({"status":true,message:"Bet saved successfully",data:createUserBet});      
    }
    else{
      res.status(200).json({"status":false, message:"Error: your bet was not saved, try again or use other means of support to reach us out"});
    }

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const getBetHistory = async (req: AuthRequest, res: Response) => {
  try {
    const {historyId} = req.params;
    const authId = req.auth?._id
    const userBetService = new UserBetService()
    const userBets = await userBetService.getBetHistories({authId, _id:new mongoose.Types.ObjectId(historyId)},1)
    if(userBets.length > 0){
      let userBet = userBets[0]
      userBet = {...userBet,matchInfo:{...userBet.matchInfo,...userBet.matchInfo.history}}
      delete userBet.matchInfo.history
      const utilityService = new UtilityService();
      let marketDefinitions: any = await utilityService.getUtilityByName(`market_definition_${userBet.matchInfo.sport.toLowerCase()}`.toLowerCase());
      marketDefinitions = marketDefinitions?marketDefinitions.data:null
      res.status(200).json({"status":true,data:userBet, marketDefinitions});
    }
    else{
      res.status(404).json({"status":false, message: "Bet history not found"});
    }
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const deleteBetHistory = async (req: AuthRequest, res: Response) => {
  try {
    const {historyId} = req.params;
    const authId = req.auth?._id
    const userBetService = new UserBetService()
    const userBets = await userBetService.updateUserBet({authId, _id:new mongoose.Types.ObjectId(historyId)},{status:-1})
    if(userBets){
      res.status(200).json({"status":true,message:"Bet deleted successfully"});
    }
    else{
      res.status(404).json({"status":false, message: "Bet history not found"});
    }
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const betHistories = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.auth?._id
    const userBetService = new UserBetService()
    const userBets = await userBetService.getBetHistories({authId,status:1},20)
    res.status(200).json({"status":true,data:userBets});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}


export const dashboardInit = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.auth?._id
    const userBetService = new UserBetService()
    const userBets = await userBetService.getBetHistories({authId,status:1},10)
    const userSettingService = new UserSettingService()
    const userSettings = await userSettingService.getUserSetting({authId})
    let settings = {}
    if(userSettings.length == 1){
      settings = userSettings[0]
    }
    const subscriptionService = new SubscriptionService()
    const subscriptions = await subscriptionService.getSubscriptionHistories({authId, status:1})
    let subscription = {}
    if(subscriptions.length > 0){
      subscription = subscriptions[0]
    }
    const userService = new UserService()
    const users = await userService.getUserDetail({authId:authId})
    let profile = {}
    if(users.length == 1){
      profile = users[0]
    }
    res.status(200).json({"status":true,data:{recentBets:userBets,settings,subscription, profile }});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}
export const betSettingsInit = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.auth?._id
    const userSettingService = new UserSettingService()
    const userSettings = await userSettingService.getUserSetting({authId})
    let settings = {}
    if(userSettings.length == 1){
      settings = userSettings[0]
    }
    res.status(200).json({"status":true,data:{settings, bookmakers:ourBookmakers, sports:ourSports, defClonedBookmakers: cloneBookmakers }});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const auth = req.auth
    const userService = new UserService()
    let user = await userService.getUserDetailProfile({authId:auth._id})
    user = {...user,...user.auth,...user.address}
    if(user.devices.length > 0){
      for(let i=0; i<user.devices.length; i++){
        if(user.devices[i].status == 1){
          user.device = user.devices[i]
          break;
        }
      }
    }
    delete user.password
    delete user.auth
    delete user.JWT
    delete user.__v
    delete user.devices
    // delete user.createdAt
    delete user.updatedAt
    delete user.authId
    delete user._id
    res.status(200).json({"status":true,data:user});
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const {oldPassword,newPassword, confirmPassword} = req.body;

    const auth = req.auth
    const authService = new AuthService()
    const updatePasswordAction = await authService.changePassword(oldPassword,newPassword,confirmPassword,auth)

    res.status(200).json(updatePasswordAction);
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}


export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.body;
    const auth = req.auth
    // Check if required fields are filled
    if(user.firstName == "" || user.lastName == "" || user.email == "" || user.username == ""){
      return res.status(400).json({status:false, message: "Fill all required fields"});
    }
    // Check if email is valid
    if(!user.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
      return res.status(400).json({status:false, message: "Invalid email address"});
    }
    // Check if email and username are unique
    const authService = new AuthService()
    const checkEmail = await authService.getAuthentication({email:user.email})
    if(checkEmail.length > 0 && !auth._id.equals(checkEmail[0]._id)){
      return res.status(400).json({status:false, message: "Email already exists"});
    }
    const checkUsername = await authService.getAuthentication({username:user.username})
    if(checkUsername.length > 0 && !auth._id.equals(checkUsername[0]._id)){
      return res.status(400).json({status:false, message: "Username already exists"});
    }

    // Update authentication
    const authUser = {id: auth._id as string, email: user.email as string, role: auth.role, username: user.username, sec: auth.password as string }
    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    // Update authentication
    const updateAuth = await authService.updateAuthentication({_id:auth._id},{email:user.email,username:user.username,dialingCode:user.dialingCode,mobile:user.mobile,JWT:refreshToken})
    if(!updateAuth){
      return res.status(500).json({"status":false,  message: "Error: Failed to update user" });  
    }

    const address = {
      address:user.address,
      apartment:user.apartment,
      city:user.city,
      postalCode:user.postalCode,
      state:user.state,
      country:user.country
    }

    // Update user
    const userService = new UserService()
    const updateUser = await userService.updateUserDetail({authId:auth._id},{firstName:user.firstName,lastName:user.lastName,address})
    if(!updateUser){
      return res.status(500).json({"status":false,  message: "Error: Failed to update user" });  
    }


    res.status(200).json({"status":true,message:"Profile updated successfully",accessToken, refreshToken,user: authUser});
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

// updateBetSettings
export const updateBetSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = req.body;
    const authId = req.auth?._id
    const userSettingService = new UserSettingService()
    const updateSettings = await userSettingService.updateUserSetting({authId},{...settings})
    if(updateSettings){
      res.status(200).json({"status":true,message:"Settings updated successfully",data:updateSettings});
    }
    else{
      res.status(500).json({"status":false,  message: "Failed to update settings" });  
    }
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}

export const pay4Subscription = async (req: AuthRequest, res: Response) => {
  try {
    
    const subscribe = req.body;
    const auth = req.auth
    const startDate = new Date();
    const endDate = new Date(startDate);
    const userAgent = createUserAgent(req)
    endDate.setDate(startDate.getDate() + Number(subscribe.plan.durationInDays));
    const newSubscription = {authId:auth._id, planId:new mongoose.Types.ObjectId(subscribe.plan._id), amount:subscribe.plan.amount, currency:subscribe.plan.currency, startDate, endDate, transactionId:subscribe.transactionId, paymentMethod:subscribe.paymentMethod, paymentDate:startDate, status:subscribe.isSuccessful?1:-2,IPAddress:userAgent.ip,transactionData:subscribe.transactionData }
    const subscriptionService = new SubscriptionService()
    const createSubscription = subscriptionService.createSubscription(newSubscription)
    if(createSubscription){
      return res.status(200).json({"status":true,message:"Subscription registration successfully",data:createSubscription});
    }
    return res.status(500).json({"status":false,  message: "Failed to register subscription" });
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });  
  }
}


export const getSubscriptionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const {historyId} = req.params;
    const authId = req.auth?._id
    const subscriptionService = new SubscriptionService()
    const subscriptions = await subscriptionService.getSubscriptionHistories({authId, _id:new mongoose.Types.ObjectId(historyId)})
    if(subscriptions.length > 0){
      res.status(200).json({"status":true,data:subscriptions[0]});
    }
    else{
      res.status(404).json({"status":false, message: "Subscription history not found"});
    }
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}

export const subscriptionHistories = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.auth?._id
    const subscriptionService = new SubscriptionService()
    const subscriptions = await subscriptionService.getSubscriptionHistories({authId})
    res.status(200).json({"status":true,data:subscriptions});

  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({"status":false,  message: error.message });    
  }
}