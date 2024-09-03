import { Request, Response } from 'express';
import logger from '../utils/logger';
import { translateBookmakerMarket,formatArbitragesForWebView } from "../utils/helpers";
import ArbitrageService from '../services/arbitrage.service';
import UtilityService from '../services/utility.service';
import { IArbitrage } from '../infrastructure/mongodb/models/arbitrage.model';



// If post arbitrage, it will send the arbitrage to the client
// If already there, delete the value of scanned_at from the req.body enter a value for updated_at
export const postArbitrage = async (req: Request, res: Response)=>{
    try{
        
        // console.log("BODY:",req.body,"\n\n")
        const data = JSON.parse(req.body.data)
        
        // console.log(data,"\n\n") 
        
        // req.body.bookmakers = JSON.parse(req.body.bookmakers)
        /**
         * In revisiting a match, the python code will fetch all status with 1, then it will group them by match_id
         * It will visit each match_id group(All bookmakers that are involved in the group and the matches) and list all the arbitrages in the match group 
         * Then it will start comparison with  what it fetched from online db, 
         * 1.(Check for new arbitrage) It will loop through the new arbitrage and check if there is arb_id that is different from the one in the db. If it is, then it will post it to the db
         * 2.(Check for updated arbitrage) It will loop through the db arbitrage and check if there is arb_id that is the same as the one in the new arbitrage. If it is, then it will check if the hash is the same,(hash contains the odds so if there is different odds, it will be different) it will ignore it, if it is different it will post it online as an update
         * While searching in part 2, if it didnt find the arbitrage in new arbitrage it means it does not exist anymore, then it will send an API post to change the status to 0, and emit to the front end to remove it.
         * 
         * 
        */

        /***
         * STEPS
         * 1. Check if the arbitrage already exist in the database using the arbId
         * 2. If it exists, check the status, if the status is 2, ignore it, if the status is -1,0,1 increment the history update it and set the status to 1
         */
        const arbitrageService = new ArbitrageService();
        let postedArbitrage = {} as IArbitrage
        let message = ""
        let emitStatus = ""
        // Check if the arbitrage already exist in the database
        const searchArbitrages = await arbitrageService.getActiveArbitrages({sport:data.sport,gameType:data.gameType,arbId:data.arbId});
        if(searchArbitrages.length > 0){
            const searchArbitrage = searchArbitrages[searchArbitrages.length - 1]
            if(searchArbitrage.status === 2){
                // If the arbitrage is marked as 2(invalid by admin), ignore it
                logger.info({status:false,message:`Arbitrage marked as invalid by admin. Arbitrage: ${data}\n`})
                res.send({status:false,message:`Arbitrage marked as invalid by admin.`})
                return
            }
            else{
                // Update the arbitrage and increment the history
                const newHistory = {scannedAt:searchArbitrage.lastScannedAt,bookmakers:searchArbitrage.bookmakers,arbPercentage:searchArbitrage.arbPercentage,scanId:searchArbitrage.lastScanId}
                data.scanId = searchArbitrage.scanId
                data.firstScannedAt = searchArbitrage.firstScannedAt
                if(searchArbitrage.history){
                    data.history = [...searchArbitrage.history,newHistory]
                }
                else{
                    data.history = [newHistory]
                }
                data.status = 1
                // console.log({searchArbitrage,data}, searchArbitrage._id?.toString())
                const updated = await arbitrageService.updateArbitrage({"_id":searchArbitrage._id},data)
                if(updated){
                    // If the arbitrage is updated successfully, set the message and emit status
                    postedArbitrage = updated
                    message = "Arbitrage updated successfully"
                    emitStatus = "update"
                }
                else{
                    res.send({status:false,message:"Could not update arbitrage"})
                    return
                }
            }
        }
        else{
            // If the arbitrage does not exist in the database, create it
            postedArbitrage = await arbitrageService.createArbitrage(data)
            message = "Arbitrage posted successfully"
            emitStatus = "new"
        }
        // Fetch the market definitions
        const utilityService = new UtilityService();
        const marketDefinitions = await utilityService.getUtilityByName(`market_definition_${data.sport}`.toLowerCase());
        if (marketDefinitions) {
            // Format the arbitrage for the web view and send it to the client
            const postReadyArbitrage = formatArbitragesForWebView([postedArbitrage],marketDefinitions.data)[0]
            const io = res.locals.socket_io
            const emitTo = `${postReadyArbitrage.sport}-${postReadyArbitrage.gameType}`.toLowerCase()
            const emitAll = `All-${postReadyArbitrage.gameType}`.toLowerCase()
            // console.log({emitTo})
            io.emit(emitTo, {status:emitStatus,data:postReadyArbitrage});
            io.emit(emitAll, {status:emitStatus,data:postReadyArbitrage}); // Emit to all sports
            res.send({status:true,message})
        }
        else{
            res.send({status:false,data:{message:"Market Definitions not found"}})
        }
            

        // Handle posting arbitrage to database, the fetch all the arbitrage and send it to the client
        // It will not get all the data from database, if it posted an arbitrage of football live, it will only send football live and send the new arbitrage data
        // At the client side, it will check if the arbitrage is already in the list, if it is, it will update it, if not, it will add it to the list in the state
        // at client, it will only update the state if the sports and isLive condition is matched
       
        // const io = res.locals.socket_io
        // io.emit('chat message', "hii from get request"); // Broadcast the message to all connected clients

        // io.emit("football-prematch", "This is football Prematch"); // Broadcast the message to all connected clients
        // io.emit("football-live", "This is football Live"); 
        // io.emit("tennis-prematch", "This is Tennis Prematch");
    }
    catch(err){
        // logger.error(`Error Posting Arbitrage: ${err} -> ${JSON.stringify(req.body)}`)
        logger.error(`Error Posting Arbitrage: ${err}`)
        res.status(500).send({status:false,message:`Error Posting Arbitrage: ${err}`})
    }
}

export const updateArbitrage = async (req: Request, res: Response)=>{
    // try{
    //     req.body.bookmakers = JSON.parse(req.body.bookmakers)
    //     let findArb = await Arbitrage.findOne({where:{arb_id:req.body.arb_id}})
    //     if(findArb){
    //         delete req.body.scanned_at
    //         let histories = JSON.parse(findArb.history)
    //         histories.push({"updated_at":findArb.updated_at,"bookmakers":JSON.parse(findArb.bookmakers)})
    //         req.body.history = histories
    //         Arbitrage.update(req.body,{where:{arb_id:req.body.arb_id}})
    //         .then(async arb_up =>{
    //             console.log("Updated Arbitrage")
    //             if(arb_up){
    //                 let arb = await Arbitrage.findOne({where:{arb_id:req.body.arb_id}})
    //                 // console.log(arb)
    //                 arb = formatArbitragesForWebView([arb.dataValues])[0]
    //                 const io = res.locals.socket_io

    //                 let emitTo = `${arb.sports}-${arb.game_type}`.toLowerCase()
    //                 io.emit(emitTo, {status:"update",data:arb});
    //                 res.send({status:true,message:"Arbitrage updated successfully"})
    //             }
    //         })
    //         .catch(err=>{
    //             console.log(err)
    //             res.status(500).send({status:false,message:`Internal Server Error while updating arbitrage ${err}`})
    //         })
    //     }
    //     else{
    //         Arbitrage.create(req.body)
    //         .then(arb =>{
    //             console.log("Posted Arbitrage")
    //             if(arb){
    //                 arb = formatArbitragesForWebView([arb.dataValues])[0]
    //                 const io = res.locals.socket_io
    //                 let emitTo = `${arb.sports}-${arb.game_type}`.toLowerCase()
    //                 io.emit(emitTo, {status:"new",data:arb});
    //                 res.send({status:true,message:"Arbitrage posted successfully"})
    //             }
    //         })
    //         .catch(err=>{
    //             console.log(err)
    //             res.status(500).send({status:false,message:`Internal Server Error while posting arbitrage ${err}`})
    //         })
    //     }
    // }
    // catch(err){
    //     console.log(`Error Posting Arbitrage: ${err} -> ${JSON.stringify(req.body)}`)
    //     res.status(500).send({status:false,message:`Error Posting Arbitrage: ${err}`})
    // }
}

export const removeArbitrage = async (req: Request, res: Response)=>{
    try{
        const data = JSON.parse(req.body.data)
        const {arbIdDict, status} = data
        // const allArbIds = Object.values(arbIdDict).flat()

        const io = res.locals.socket_io
        const errors: any[] = [];
        const arbitrageService = new ArbitrageService();


        Object.entries(arbIdDict).forEach(async ([key, value]) => {
            try {
                const condition = { arbId: { $in: value } }
                const newValueUpdate = { status }
                const result = await arbitrageService.updateManyArbitrage(condition, newValueUpdate)
                if (result === null) {
                    throw new Error(`Error removing arbitrage for ${key}`);
                }

                const emitTo = key.toLowerCase();
                io.emit(emitTo, { status: "remove", data: value });
            } catch (err) {
                errors.push(err);
                // Continue to the next iteration
            }
        });
        
        if (errors.length > 0) {
            logger.error(`Errors occurred while removing arbitrage: ${errors}`);
            res.status(500).send({ status: false, message: "Errors occurred while removing arbitrage", errors });
        } else {
            res.send({ status: true, message: "Arbitrage remove successfully" });
        }
    }
    catch(err){
        logger.error(`Error Removing Arbitrage: ${err}`)
        res.status(500).send({status:false,message:`Error Removing Arbitrage: ${err}`})
    }

}
