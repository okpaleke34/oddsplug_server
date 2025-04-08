import { Request, Response } from 'express';
import MatchedMarketService from '../services/matched-market.service';
import { translateBookmakerMarket } from '../utils/helpers';
import logger from '../utils/logger';
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


const MONGO_ENGINE_URI = process.env.MONGO_ENGINE_URI || "";

// Connect to MongoDB
export const connectToDB = async (collection, db="system") => {
  const dbSuffix = `oddsplug_${db}?authSource=admin`;
  const fullUri = MONGO_ENGINE_URI + dbSuffix;
  const connection = await  mongoose.createConnection(fullUri);
  let genericModel;
  if (collection === "scan_history") {
    genericModel = genericModel = connection.model(
      "ScanHistory",
      new mongoose.Schema({scanId:String,sport:String,status:String,eventType:String,scanType:String}, { collection: collection, strict: false })
    );
  }
  else if (collection === "revalidate_history") {
    genericModel = connection.model(
      "RevalidatorHistory",
      new mongoose.Schema({sport:String}, { collection: collection, strict: false })
    );
  }
  else if (collection === "server") {
    genericModel = connection.model(
      "Server",
      new mongoose.Schema({}, { collection: collection, strict: false })
    );
  }
  return {connection, genericModel};
};


// Fetch scan_history from selected DB
export const systemScanHistories = async (req: Request, res: Response) => {
  try {
    const {connection, genericModel:ScanHistory } = await connectToDB("scan_history", "system");
    const {filter,limit,page} = req.body;
    const skip = (page - 1) * limit;
    let records;
    if(filter){
      records = await ScanHistory.find(filter).sort({ startedAt: -1 }).skip(skip).limit(limit).exec();
    }
    else{
      records = await ScanHistory.find().sort({ startedAt: -1 }).skip(skip).limit(limit).exec();
    }
    res.json({ status: true, data: records });

    await connection.close();
    // mongoose.disconnect();
  } catch (err) {
    logger.error("Error in systemScanHistories:", err);
    res.status(500).json({status:false,message:`Error Fetching Scan Histories: ${err}`});
  }
};

// Fetch scan_history by scanId

export const systemScanHistory = async (req: Request, res: Response) => {
  try {
    const {connection, genericModel:ScanHistory } = await connectToDB("scan_history", "system");
    const scanId = req.params.scanId
    const record = await ScanHistory.find({scanId}).exec();
    res.json({ status: true, data: record });
    await connection.close();
  } catch (err) {
    logger.error("Error in systemScanHistory:", err);
    res.status(500).json({status:false,message:`Error Fetching Scan History: ${err}`});
  }
};



// Fetch revalidate_history from selected DB
export const systemRevalidateHistories = async (req: Request, res: Response) => {
  try {
    const {connection, genericModel:RevalidateHistory } = await connectToDB("revalidate_history", "system");
    const {filter,limit,page} = req.body;

    const skip = (page - 1) * limit;
    let records;
    if(filter){
      records = await RevalidateHistory.find(filter).sort({ date: -1 }).skip(skip).limit(limit).exec();
    }
    else{
      records = await RevalidateHistory.find().sort({ date: -1 }).skip(skip).limit(limit).exec();
    }
    res.json({ status: true, data: records });

    await connection.close();
  } catch (err) {
    logger.error("Error in systemRevalidateHistories:", err);
    res.status(500).json({status:false,message:`Error Fetching Revalidate Histories: ${err}`});
  }
};

// Fetch revalidate_history by scanId
export const systemRevalidateHistory = async (req: Request, res: Response) => {
  try {
    const {connection, genericModel:RevalidateHistory } = await connectToDB("revalidate_history", "system");
    const scanId = req.params.scanId
    const record = await RevalidateHistory.find({scan_id:scanId}).exec();
    res.json({ status: true, data: record });
    await connection.close();
  } catch (err) {
    logger.error("Error in systemRevalidateHistory:", err);
    res.status(500).json({status:false,message:`Error Fetching matched Revalidate History: ${err}`});
  }
};



export const systemServers = async (req: Request, res: Response)=>{
  try{
    const {connection, genericModel:Server } = await connectToDB("server", "system");
    const records = await Server.find().exec();
    res.json({ status: true, data: records });
    await connection.close();
  }
  catch(err){
    logger.error(`Error in systemServers: ${err}`)
    res.status(500).send({status:false,message:`Error Fetching system servers: ${err}`})
  }
}