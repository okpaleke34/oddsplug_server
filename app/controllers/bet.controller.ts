import { Request, Response } from 'express';
import ArbitrageService from '../services/arbitrage.service';
import logger from '../utils/logger';
import { formatArbitragesForWebView, groupBySport } from "../utils/helpers";
import UtilityService from '../services/utility.service';


export const fetchArbitrages = async (req: Request, res: Response) => {
  try {
    const {sport,gameType} = req.body;
    const filter:any = {gameType,status:1}
    if(sport != "All")
      filter.sport = sport

    // console.log({filter})
    const arbitrageService = new ArbitrageService();
    const activeArbitrages = await arbitrageService.getActiveArbitrages(filter);
    const utilityService = new UtilityService();
    let organizedArbitrages = {}
    if(sport == "All"){
      organizedArbitrages = groupBySport(activeArbitrages)
    }
    else{
      organizedArbitrages = {[sport]:activeArbitrages}
    }

    let webReadyArbitrages:any[] = []
    // Loop through the matches to put the market definitions on the arbitrages
    // TODO: Make the market definition to be added while the arbitrage is being saved so that it will save time it will use to handle this part of code
    for(const sportName in organizedArbitrages){
      if (organizedArbitrages.hasOwnProperty(sportName)) {
        const marketDefinitions = await utilityService.getUtilityByName(`market_definition_${sportName}`.toLowerCase());
        if (marketDefinitions) {          
          const sportWebReadyArbitrages = formatArbitragesForWebView(organizedArbitrages[sportName],marketDefinitions.data);
          webReadyArbitrages = [...webReadyArbitrages,...sportWebReadyArbitrages]
        }
        else{
          logger.error(`Market definitions not found on ${sportName}`)
        }
    }
  }
  res.status(200).json({"status":true,data:webReadyArbitrages});
  }
  catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });    
  }
};