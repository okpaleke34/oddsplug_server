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
const fetchArbitrages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arbitrageService = new arbitrage_service_1.default();
        const arbitrages = yield arbitrageService.fetchArbitrages();
        res.status(200).json(arbitrages);
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.fetchArbitrages = fetchArbitrages;
