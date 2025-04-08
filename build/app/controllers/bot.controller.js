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
exports.sendTelegramMessage = exports.removeArbitrage = exports.updateArbitrage = exports.postArbitrage = exports.sendNotification = exports.sendNotificationService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const web_push_1 = __importDefault(require("web-push"));
const helpers_1 = require("../utils/helpers");
const arbitrage_service_1 = __importDefault(require("../services/arbitrage.service"));
const utility_service_1 = __importDefault(require("../services/utility.service"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const config_1 = __importDefault(require("../utils/config"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const exclusion_rule_service_1 = __importDefault(require("../services/exclusion-rule.service"));
const sendNotificationService = (title, body, minArbitrage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authService = new auth_service_1.default();
        const usersSubscriptions = yield authService.getArbitrageUsersSubscriptions(minArbitrage);
        if (usersSubscriptions.length == 0) {
            return { status: true, message: "No user found to send the notification" };
        }
        const notificationPayload = {
            title,
            body,
            icon: "https://oddsplug.com/public/icon-192x192.png",
            data: {
                url: "https://oddsplug.com",
            },
        };
        try {
            web_push_1.default.setVapidDetails("mailto:okpaleke34.pl@gmail.com", config_1.default.vapid.public, config_1.default.vapid.private);
            // Send notifications to all subscriptions in parallel
            yield Promise.all(usersSubscriptions.map((subscription) => web_push_1.default.sendNotification(subscription, JSON.stringify(notificationPayload))));
            // Return a success result
            return { status: true, message: "Notification sent successfully." };
        }
        catch (error) {
            // Log the error and return a failure result
            logger_1.default.error(`Error sending notification: ${error}`);
            return { status: false, message: `Failed to send notification: ${error}` };
        }
    }
    catch (error) {
        logger_1.default.error(`Error sending notification : ${error}`);
        return { status: false, message: `Failed to send notification: ${error}` };
    }
});
exports.sendNotificationService = sendNotificationService;
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = "Test Notification";
    const body = "This is a test notification";
    const result = yield (0, exports.sendNotificationService)(title, body, 1);
    res.status(200).json(result);
});
exports.sendNotification = sendNotification;
// If post arbitrage, it will send the arbitrage to the client
// If already there, delete the value of scanned_at from the req.body enter a value for updated_at
const postArbitrage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("BODY:",req.body,"\n\n")
        const data = JSON.parse(req.body.data);
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
        // Check if arbitrage is in exclusion list
        const exclusionRuleService = new exclusion_rule_service_1.default();
        const exclusionRules = yield exclusionRuleService.getExclusionRule({ status: 1 });
        const rules = exclusionRules.map((exclusionRule) => exclusionRule.rule);
        const { validArbitrages, rejectedArbitrages, rejectedArbitragesIds } = (0, helpers_1.filterArbList)([data], rules);
        if (rejectedArbitrages.length > 0) {
            // If the arbitrage is in the exclusion list, ignore it
            res.send({ status: true, message: `Arbitrage in exclusion list.` });
            return;
        }
        /***
         * STEPS
         * 1. Check if the arbitrage already exist in the database using the arbId
         * 2. If it exists, check the status, if the status is 2, ignore it, if the status is -1,0,1 increment the history update it and set the status to 1
         */
        const arbitrageService = new arbitrage_service_1.default();
        let postedArbitrage = {};
        let message = "";
        let emitStatus = "";
        // Check if the arbitrage already exist in the database
        const searchArbitrages = yield arbitrageService.getActiveArbitrages({ sport: data.sport, gameType: data.gameType, arbId: data.arbId });
        if (searchArbitrages.length > 0) {
            const searchArbitrage = searchArbitrages[searchArbitrages.length - 1];
            if (searchArbitrage.status === 2) {
                // If the arbitrage is marked as 2(invalid by admin), ignore it
                // logger.info({status:false,message:`Arbitrage marked as invalid by admin. Arbitrage: ${data}\n`})
                res.send({ status: true, message: `Arbitrage marked as invalid by admin.` });
                return;
            }
            else {
                // Update the arbitrage and increment the history
                const newHistory = { scannedAt: searchArbitrage.lastScannedAt, bookmakers: searchArbitrage.bookmakers, arbPercentage: searchArbitrage.arbPercentage, scanId: searchArbitrage.lastScanId };
                data.scanId = searchArbitrage.scanId;
                data.firstScannedAt = searchArbitrage.firstScannedAt;
                if (searchArbitrage.history) {
                    data.history = [...searchArbitrage.history, newHistory];
                }
                else {
                    data.history = [newHistory];
                }
                data.status = 1;
                // console.log({searchArbitrage,data}, searchArbitrage._id?.toString())
                const updated = yield arbitrageService.updateArbitrage({ "_id": searchArbitrage._id }, data);
                if (updated) {
                    // If the arbitrage is updated successfully, set the message and emit status
                    postedArbitrage = updated;
                    message = "Arbitrage updated successfully";
                    emitStatus = "update";
                }
                else {
                    res.send({ status: false, message: "Could not update arbitrage" });
                    return;
                }
            }
        }
        else {
            // If the arbitrage does not exist in the database, create it
            postedArbitrage = yield arbitrageService.createArbitrage(data);
            message = "Arbitrage posted successfully";
            emitStatus = "new";
        }
        // Fetch the market definitions
        const utilityService = new utility_service_1.default();
        const marketDefinitions = yield utilityService.getUtilityByName(`market_definition_${data.sport}`.toLowerCase());
        if (marketDefinitions) {
            // Format the arbitrage for the web view and send it to the client
            const postReadyArbitrage = (0, helpers_1.formatArbitragesForWebView)([postedArbitrage], marketDefinitions.data)[0];
            const io = res.locals.socket_io;
            const emitTo = `${postReadyArbitrage.sport}-${postReadyArbitrage.gameType}`.toLowerCase();
            const emitAll = `All-${postReadyArbitrage.gameType}`.toLowerCase();
            // console.log({emitTo})
            io.emit(emitTo, { status: emitStatus, data: postReadyArbitrage });
            io.emit(emitAll, { status: emitStatus, data: postReadyArbitrage }); // Emit to all sports
            // const title = `Oddsplug: 2.01% Arbitrage`
            const title = `Oddsplug: ${postReadyArbitrage.arbPercentage * 10}% Arbitrage`;
            const body = `${postReadyArbitrage.bookmakers[0].teams} ${postReadyArbitrage.market} ${postReadyArbitrage.market}`;
            // TODO: Make sure the gameType, bookmaker and sports is the one that the user subscribed to
            const result = yield (0, exports.sendNotificationService)(title, body, 2);
            res.send({ status: true, message });
        }
        else {
            res.send({ status: false, data: { message: "Market Definitions not found" } });
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
    catch (err) {
        // logger.error(`Error Posting Arbitrage: ${err} -> ${JSON.stringify(req.body)}`)
        logger_1.default.error(`Error Posting Arbitrage: ${err}`);
        res.status(500).send({ status: false, message: `Error Posting Arbitrage: ${err}` });
    }
});
exports.postArbitrage = postArbitrage;
const updateArbitrage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.updateArbitrage = updateArbitrage;
const removeArbitrage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(req.body.data);
        const { arbIdDict, status } = data;
        // const allArbIds = Object.values(arbIdDict).flat()
        const io = res.locals.socket_io;
        const errors = [];
        const arbitrageService = new arbitrage_service_1.default();
        Object.entries(arbIdDict).forEach((_a) => __awaiter(void 0, [_a], void 0, function* ([key, value]) {
            try {
                const condition = { arbId: { $in: value } };
                const newValueUpdate = { status };
                const result = yield arbitrageService.updateManyArbitrage(condition, newValueUpdate);
                if (result === null) {
                    throw new Error(`Error removing arbitrage for ${key}`);
                }
                const emitTo = key.toLowerCase();
                io.emit(emitTo, { status: "remove", data: value });
                // Emit to all sports
                const keySplitArr = key.split("-");
                const gameType = keySplitArr[keySplitArr.length - 1];
                const emitAll = `All-${gameType}`.toLowerCase();
                io.emit(emitAll, { status: "remove", data: value }); // Emit to all sports
            }
            catch (err) {
                errors.push(err);
                // Continue to the next iteration
            }
        }));
        if (errors.length > 0) {
            logger_1.default.error(`Errors occurred while removing arbitrage: ${errors}`);
            res.status(500).send({ status: false, message: "Errors occurred while removing arbitrage", errors });
        }
        else {
            res.send({ status: true, message: "Arbitrage remove successfully" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error Removing Arbitrage: ${err}`);
        res.status(500).send({ status: false, message: `Error Removing Arbitrage: ${err}` });
    }
});
exports.removeArbitrage = removeArbitrage;
const sendTelegramMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(req.body.data);
        const { chatId, message } = data;
        const bot = new node_telegram_bot_api_1.default(config_1.default.telegramBotToken);
        const result = yield bot.sendMessage(chatId, JSON.stringify(message));
        if (result) {
            res.send({ status: true, message: "Telegram message sent successfully" });
        }
        else {
            res.send({ status: false, message: "Error sending Telegram message" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error Sending Telegram Message: ${err}`);
        res.status(500).send({ status: false, message: `Error Sending Telegram Message: ${err}` });
    }
});
exports.sendTelegramMessage = sendTelegramMessage;
