import { Request, Response } from 'express';
import AdminService from '../services/admin.service';

export const getAdmins = async (req: Request, res: Response) => {
  // try {
  //   const { getAdmins } = new AdminService();
  //   const arbitrages = await getAdmins();
  //   const admins = await Admin.find();
  //   res.json(admins);
  // }
  // catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};

export const createAdmin = async (req: Request, res: Response) => {
  // const { name, email, permissions } = req.body;
  // try {
  //   const admin = new Admin({ name, email, permissions });
  //   await admin.save();
  //   res.status(201).json(admin);
  // }
  // catch (error) {
  //   res.status(400).json({ message: error.message });
  // }
};



export const matchedMarketsList = async (req: Request, res: Response)=>{
  // try{
  //     db.MatchedMarket.findAll({attributes:{exclude:["id","createdAt","updatedAt","translated_markets","matched_markets"]}})
  //     .then(mms=>{
  //         if(mms){
  //             res.json({status:true,data:mms})
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }

}

export const matchedMarketsPage = async (req: Request, res: Response)=>{
  // try{
      
  //     let {sport,bookmaker} = req.params
  //     db.MatchedMarket.findOne({where:{sport,bookmaker},attributes:{exclude:["id","createdAt","updatedAt","translated_markets","matched_markets"]}})
  //     .then(mm=>{
  //         // console.log({mm,sport,bookmaker})
  //         if(mm){
  //             mm.dataValues.our_market_mock_url = `${apiServer}/data/universal/${mm.our_market_mock}`
  //             mm.dataValues.our_market_names_url = `${apiServer}/data/universal/${mm.our_market_names}`
  //             res.json({status:true,data:mm})
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }

}


export const bookmakerTranslatedMarket = async (req: Request, res: Response)=>{
  // try{
  //     let {sport,bookmaker} = req.params
  //     db.MatchedMarket.findOne({where:{sport,bookmaker}})
  //     .then(mm=>{
  //         if(mm){
  //             if(mm.translated_markets.length === 0){
  //                 // It means that the translated markets has not been done, so it will go to the file and translate it and save
  //                 let bookmaker_market = require(`../data/bookmakers/${mm.bookmaker_market}`)
  //                 let translatedBookmakerMarket = translateBookmakerMarket(mm.bookmaker,bookmaker_market)
  //                 // save to db
  //                 mm.translated_markets = translatedBookmakerMarket
  //                 mm.save()
  //             }                
  //             res.json({status:true ,data:mm.translated_markets})
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }
}



export const bookmakerMatchedMarket = async (req: Request, res: Response)=>{
  // try{
  //     let {sport,bookmaker} = req.params
  //     db.MatchedMarket.findOne({where:{sport,bookmaker}})
  //     .then(mm=>{
  //         if(mm){  
  //             res.json({status:true ,data:mm.matched_markets})
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }
}

export const bookmakerMatchedMarketJSON = async (req: Request, res: Response)=>{
  // try{
  //     let {sport,bookmaker} = req.params
  //     db.MatchedMarket.findOne({where:{sport,bookmaker}})
  //     .then(mm=>{
  //         if(mm){  
  //             // res.json({status:true ,data:mm.matched_markets})
  //             res.json(mm)
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }
}


export const saveMatchedMarketsState = async (req: Request, res: Response)=>{
  // try{
  //     let {sport,bookmaker,matchedMarket,bookmakerMarket} = req.body
  //     // console.log({bookmakerMarket},bookmakerMarket[0])
  //     db.MatchedMarket.update({matched_markets:matchedMarket,translated_markets:bookmakerMarket},{where:{sport,bookmaker}})
  //     .then(count=>{
  //         if(count > 0){
  //             res.json({status:true,message:"Matched Markets State Saved"})
  //         }
  //         else{
  //             res.json({status:false,message:"No Matched Market Found"})
  //         }
  //     })
  // }
  // catch(err){
  //     console.log(`Error Fetching Page Information: ${err}`)
  //     res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  // }
}
