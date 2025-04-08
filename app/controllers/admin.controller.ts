import { Request, Response } from 'express';
import MatchedMarketService from '../services/matched-market.service';
import ArbitrageService from '../services/arbitrage.service';
import { filterArbList, translateBookmakerMarket } from '../utils/helpers';
import logger from '../utils/logger';
import ExclusionRuleService from '../services/exclusion-rule.service';


const domain = "https://oddsplug.com"
const apiServer = process.env.NODE_ENV !== 'production' ? 'http://localhost:4001' : "https://api.oddsplug.com"

export const matchedMarketsList = async (req: Request, res: Response)=>{
  try{
    const matchedMarketService = new MatchedMarketService();
    const matchedMarkets = await matchedMarketService.getAllMatchedMarket();
    // Only return the bookmaker and sport
    const matchedMarketsItems = matchedMarkets.map((mm: any) => {
      return { bookmaker: mm.bookmaker, sport: mm.sport };
    });
    res.json({ status: true, data: matchedMarketsItems });
  }
  catch(err){
    logger.error(`Error in matchedMarketsList: ${err}`)
    res.status(500).send({status:false,message:`Error Fetching matched market list: ${err}`})
  }

}

export const matchedMarketsPage = async (req: Request, res: Response)=>{
  try{      
    const {sport,bookmaker} = req.params
    const matchedMarketService = new MatchedMarketService();
    const matchedMarket = await matchedMarketService.getMatchedMarketData({sport,bookmaker});
    if(matchedMarket.length == 1){
      let mm = matchedMarket[0] as any
      const our_market_mock_url = `${apiServer}/data/universal/${mm.ourMarketMock}`
      const our_market_names_url = `${apiServer}/data/universal/${mm.ourMarketDefinition}`
      mm = {...mm._doc,our_market_mock_url,our_market_names_url}
      res.json({status:true,data:mm})
    }
    else{
      res.json({status:false,message:"No Matched Market Found"})
    }
  }
  catch(err){
    logger.error(`Error Fetching Page Information: ${err}`)
    res.status(500).send({status:false,message:`Error Fetching Page Information: ${err}`})
  }

}


export const bookmakerTranslatedMarket = async (req: Request, res: Response)=>{
  try{
    const {sport,bookmaker} = req.params
    const matchedMarketService = new MatchedMarketService();
    const matchedMarket = await matchedMarketService.getMatchedMarketData({sport,bookmaker});
    if(matchedMarket.length == 1){
      if(matchedMarket[0].translatedMarkets.length === 0){
        // Translate the bookmaker market
        const mm = matchedMarket[0]
        const bookmakerMarket = await import(`../data/bookmakers/${mm.bookmakerMarket}`);
        const translatedBookmakerMarket = translateBookmakerMarket(mm.bookmaker,bookmakerMarket)
        let saved2DB = false
        if(translatedBookmakerMarket){
          // save to db
          const updated = await matchedMarketService.updateMatchedMarket({sport,bookmaker},{translatedMarkets:translatedBookmakerMarket})
          saved2DB = updated?true:false
        }
        if(saved2DB){
          res.json({status:true,data:translatedBookmakerMarket})
        }
        else{
          res.json({status:false,message:"No Matched Market Found"})
        }
      }
      else{
        // Return the translated market
        res.json({status:true,data:matchedMarket[0].translatedMarkets})
      }
    }
    else{
      res.json({status:false,message:"No Matched Market Found"})
    }
  }
  catch(err){
    logger.error(`Error in bookmakerTranslatedMarket: ${err}`)
    res.status(500).send({status:false,message:`Error translating bookmaker market: ${err}`})
  }
}



export const bookmakerMatchedMarket = async (req: Request, res: Response)=>{
  try{
    const {sport,bookmaker} = req.params
    const matchedMarketService = new MatchedMarketService();
    const matchedMarket = await matchedMarketService.getMatchedMarketData({sport,bookmaker});
    if(matchedMarket.length > 0){
      res.json({status:true,data:matchedMarket[0].matchedMarkets})
    }
    else{
      res.json({status:false,message:"No Matched Market Found"})
    }
  }
  catch(err){
    logger.error(`Error in bookmakerMatchedMarket: ${err}`)
    res.status(500).send({status:false,message:`Error Fetching Bookmaker Matched Market: ${err}`})
  }
}

export const saveMatchedMarketsState = async (req: Request, res: Response)=>{
  try{
    const {sport,bookmaker,matchedMarket,bookmakerMarket} = req.body
    const matchedMarketService = new MatchedMarketService();
    const updatedMatchedMarket = await matchedMarketService.updateMatchedMarket({sport,bookmaker},{matchedMarkets:matchedMarket,translatedMarkets:bookmakerMarket});
    if(updatedMatchedMarket){
      res.json({status:true,message:"Matched Markets State Saved"})
    }
    else{
      res.json({status:false,message:"No Matched Market Found"})
    }
  }
  catch(err){
    logger.error(`Error in saveMatchedMarketsState: ${err}`)
    res.status(500).send({status:false,message:`Error Saving matched market state: ${err}`})
  }
}

const applyExclusionRule = async (rules: any[]) => {
  const arbitrageService = new ArbitrageService();
  const activeArbitrages = await arbitrageService.getActiveArbitrages({status:1});
  const { validArbitrages, rejectedArbitrages, rejectedArbitragesIds } = filterArbList(activeArbitrages, rules);
  const condition = { _id: { $in: rejectedArbitragesIds } }
  const newValueUpdate = { status: 2 }
  const updatedArbitragesCount = await arbitrageService.updateManyArbitrage(condition, newValueUpdate)
  if(updatedArbitragesCount || updatedArbitragesCount == 0){
    return {status:true,message:"Exclusion applied successful",updatedArbitragesCount}
  }
  else{
    return {status:false,message:"Failed to apply exclusion rule"}
  }
}


export const exclusionRulesList = async (req: Request, res: Response)=>{
  try{
    const exclusionRuleService = new ExclusionRuleService();
    let exclusionRules = await exclusionRuleService.getAllExclusionRule();
    // Sort by status
    exclusionRules = exclusionRules.sort((a: any, b: any) => {
      if (a.status === b.status) {
        return 0;
      }
      return a.status === 1 ? -1 : 1;
    });
    res.json({status:true,data:exclusionRules})
  }
  catch(err){
    logger.error(`Error in exclusionRulesList: ${err}`)
    res.status(500).send({status:false,message:`Error Fetching Exclusion Rules: ${err}`})
  }
}

export const addExclusionRule = async (req: Request, res: Response)=>{
  try{
    const {name, rule, status} = req.body
    const adminId = "124323"
    // rule = {
    //   scanId: "any",
    //   marketCode: "p_highest_score_quarter",
    //   bookmaker: "any",
    //   sport: "Basketball",
    //   matchId: "Gmunden_Klosterneuburg_1743953400",
    //   gameType: "any",
    //   arbId: "any",
    // }

    // If status is not provided, set it to 0 which means the rule will apply once and not be running for the next arbitrages
    // if(!status){
    //   status = 0
    // }
    const rules = [rule]
    const applyResult = await applyExclusionRule(rules);
    if(applyResult.status){
      // Save the exclusion rule to the database
      const exclusionRuleService = new ExclusionRuleService();
      // const exclusionRule = await exclusionRuleService.createExclusionRule({name:"New Rule",adminId,rule:newRule,status:1});
      const exclusionRule = await exclusionRuleService.createExclusionRule({name,adminId,rule,status});
      if(exclusionRule){
        res.json({status:true,message:`Exclusion Rule Created, new rule was applied in ${applyResult.updatedArbitragesCount} arbitrages`})
      }
      else{
        res.json({status:false,message:`Exclusion Rule Not Created but new rule was applied in ${applyResult.updatedArbitragesCount} arbitrages`})
      }
    }
    else{
      res.json({status:false,message:`Exclusion rule was not created and new rule was not applied`})
    }
  }
  catch(err){
    logger.error(`Error in addExclusionRule: ${err}`)
    res.status(500).send({status:false,message:`Error saving exclusion rule: ${err}`})
  }
}



export const runExclusionRule = async (req: Request, res: Response)=>{
  try{
    const {rule} = req.body
    const rules = [rule]
    const applyResult = await applyExclusionRule(rules);
    if(applyResult.status){
      res.json({status:true,message:`Exclusion Rule was applied in ${applyResult.updatedArbitragesCount} arbitrages`})
    }
    else{
      res.json(applyResult)
    }
  }
  catch(err){
    logger.error(`Error in runExclusionRule: ${err}`)
    res.status(500).send({status:false,message:`Error in applying exclusion rule: ${err}`})
  }
}

export const editExclusionRule = async (req: Request, res: Response)=>{
  try{
    const {name, rule, status, id} = req.body
    const adminId = "124323"
    // // If status is not provided, set it to 0 which means the rule will apply once and not be running for the next arbitrages
    // if(!status){
    //   status = 0
    // }
    // Save the exclusion rule to the database
    const exclusionRuleService = new ExclusionRuleService();
    const updatedExclusionRule = await exclusionRuleService.updateExclusionRule({_id:id},{name,adminId,rule,status});
    if(updatedExclusionRule){
      res.json({status:true,message:"Exclusion rule updated successfully"})
    }
    else{
      res.json({status:false,message:"Failed to update Exclusion rule"})
    }
  }
  catch(err){
    logger.error(`Error in editExclusionRule: ${err}`)
    res.status(500).send({status:false,message:`Error updating exclusion rule: ${err}`})
  }
}

export const deleteExclusionRule = async(req: Request, res: Response)=>{
  try{
    const {ruleId} = req.params
    // Delete exclusion rule from the database
    const exclusionRuleService = new ExclusionRuleService();
    const deleteExclusionRuleResult = await exclusionRuleService.deleteExclusionRule(ruleId)
    if(deleteExclusionRuleResult){
      res.json({status:true,message:"Exclusion rule deleted successfully"})
    }
    else{
      res.json({status:false,message:"Failed to delete exclusion rule"})
    }
  }
  catch(err){
    logger.error(`Error in deleteExclusionRule: ${err}`)
    res.status(500).send({status:false,message:`Error deleting exclusion rule: ${err}`})
  }
}


export const arbitragesPageInfo = async(req: Request, res: Response)=>{
  try{
    const arbitrageService = new ArbitrageService()
    const aggregate = [
      {
        $match: { status: 1 }
      },
      {
        $group: {
          _id: { sport: "$sport", gameType: "$gameType" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.sport",
          stats: {
            $push: {
              k: "$_id.gameType",
              v: "$count"
            }
          }
        }
      },
      {
        $project: {
          prematch: {
            $let: {
              vars: {
                p: {
                  $first: {
                    $filter: {
                      input: "$stats",
                      as: "s",
                      cond: { $eq: ["$$s.k", "prematch"] }
                    }
                  }
                }
              },
              in: { $ifNull: ["$$p.v", 0] }
            }
          },
          live: {
            $let: {
              vars: {
                l: {
                  $first: {
                    $filter: {
                      input: "$stats",
                      as: "s",
                      cond: { $eq: ["$$s.k", "live"] }
                    }
                  }
                }
              },
              in: { $ifNull: ["$$l.v", 0] }
            }
          },
          sport: "$_id",
          _id: 0
        }
      }
    ]
    const arbitrageStats = await arbitrageService.getAggregate(aggregate)
    arbitrageStats.sort((a, b) => a.sport.localeCompare(b.sport)); //Sort by sport name
    res.json({status:true,message:"Failed to delete exclusion rule", data:{arbitrageStats}})
  }
  catch(err){
    logger.error(`Error in arbitragesPageInfo: ${err}`)
    res.status(500).send({status:false,message:`Error fetching data: ${err}`})
  }
}
