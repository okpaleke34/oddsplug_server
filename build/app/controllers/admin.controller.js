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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchedMarketsState = exports.bookmakerMatchedMarketJSON = exports.bookmakerMatchedMarket = exports.bookmakerTranslatedMarket = exports.matchedMarketsPage = exports.matchedMarketsList = exports.createAdmin = exports.getAdmins = void 0;
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const { getAdmins } = new AdminService();
    //   const arbitrages = await getAdmins();
    //   const admins = await Admin.find();
    //   res.json(admins);
    // }
    // catch (error) {
    //   res.status(500).json({ message: error.message });
    // }
});
exports.getAdmins = getAdmins;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { name, email, permissions } = req.body;
    // try {
    //   const admin = new Admin({ name, email, permissions });
    //   await admin.save();
    //   res.status(201).json(admin);
    // }
    // catch (error) {
    //   res.status(400).json({ message: error.message });
    // }
});
exports.createAdmin = createAdmin;
const matchedMarketsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.matchedMarketsList = matchedMarketsList;
const matchedMarketsPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.matchedMarketsPage = matchedMarketsPage;
const bookmakerTranslatedMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.bookmakerTranslatedMarket = bookmakerTranslatedMarket;
const bookmakerMatchedMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.bookmakerMatchedMarket = bookmakerMatchedMarket;
const bookmakerMatchedMarketJSON = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.bookmakerMatchedMarketJSON = bookmakerMatchedMarketJSON;
const saveMatchedMarketsState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.saveMatchedMarketsState = saveMatchedMarketsState;
