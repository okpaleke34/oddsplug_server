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
exports.fetchArbitrages = void 0;
const arbitrage_service_1 = __importDefault(require("../services/arbitrage.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const helpers_1 = require("../utils/helpers");
const utility_service_1 = __importDefault(require("../services/utility.service"));
const fetchArbitrages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sport, gameType } = req.body;
        const filter = { gameType, status: 1 };
        if (sport != "All")
            filter.sport = sport;
        // console.log({filter})
        const arbitrageService = new arbitrage_service_1.default();
        const activeArbitrages = yield arbitrageService.getActiveArbitrages(filter);
        const utilityService = new utility_service_1.default();
        let organizedArbitrages = {};
        if (sport == "All") {
            organizedArbitrages = (0, helpers_1.groupBySport)(activeArbitrages);
        }
        else {
            organizedArbitrages = { [sport]: activeArbitrages };
        }
        let webReadyArbitrages = [];
        // Loop through the matches to put the market definitions on the arbitrages
        // TODO: Make the market definition to be added while the arbitrage is being saved so that it will save time it will use to handle this part of code
        for (const sportName in organizedArbitrages) {
            if (organizedArbitrages.hasOwnProperty(sportName)) {
                const marketDefinitions = yield utilityService.getUtilityByName(`market_definition_${sportName}`.toLowerCase());
                if (marketDefinitions) {
                    const sportWebReadyArbitrages = (0, helpers_1.formatArbitragesForWebView)(organizedArbitrages[sportName], marketDefinitions.data);
                    webReadyArbitrages = [...webReadyArbitrages, ...sportWebReadyArbitrages];
                }
                else {
                    logger_1.default.error(`Market definitions not found on ${sportName}`);
                }
            }
        }
        res.status(200).json({ "status": true, data: webReadyArbitrages });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.fetchArbitrages = fetchArbitrages;
