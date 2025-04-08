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
exports.systemServers = exports.systemRevalidateHistory = exports.systemRevalidateHistories = exports.systemScanHistory = exports.systemScanHistories = exports.connectToDB = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_ENGINE_URI = process.env.MONGO_ENGINE_URI || "";
// Connect to MongoDB
const connectToDB = (collection_1, ...args_1) => __awaiter(void 0, [collection_1, ...args_1], void 0, function* (collection, db = "system") {
    const dbSuffix = `oddsplug_${db}?authSource=admin`;
    const fullUri = MONGO_ENGINE_URI + dbSuffix;
    const connection = yield mongoose_1.default.createConnection(fullUri);
    let genericModel;
    if (collection === "scan_history") {
        genericModel = genericModel = connection.model("ScanHistory", new mongoose_1.default.Schema({ scanId: String, sport: String, status: String, eventType: String, scanType: String }, { collection: collection, strict: false }));
    }
    else if (collection === "revalidate_history") {
        genericModel = connection.model("RevalidatorHistory", new mongoose_1.default.Schema({ sport: String }, { collection: collection, strict: false }));
    }
    else if (collection === "server") {
        genericModel = connection.model("Server", new mongoose_1.default.Schema({}, { collection: collection, strict: false }));
    }
    return { connection, genericModel };
});
exports.connectToDB = connectToDB;
// Fetch scan_history from selected DB
const systemScanHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection, genericModel: ScanHistory } = yield (0, exports.connectToDB)("scan_history", "system");
        const { filter, limit, page } = req.body;
        const skip = (page - 1) * limit;
        let records;
        if (filter) {
            records = yield ScanHistory.find(filter).sort({ startedAt: -1 }).skip(skip).limit(limit).exec();
        }
        else {
            records = yield ScanHistory.find().sort({ startedAt: -1 }).skip(skip).limit(limit).exec();
        }
        res.json({ status: true, data: records });
        yield connection.close();
        // mongoose.disconnect();
    }
    catch (err) {
        logger_1.default.error("Error in systemScanHistories:", err);
        res.status(500).json({ status: false, message: `Error Fetching Scan Histories: ${err}` });
    }
});
exports.systemScanHistories = systemScanHistories;
// Fetch scan_history by scanId
const systemScanHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection, genericModel: ScanHistory } = yield (0, exports.connectToDB)("scan_history", "system");
        const scanId = req.params.scanId;
        const record = yield ScanHistory.find({ scanId }).exec();
        res.json({ status: true, data: record });
        yield connection.close();
    }
    catch (err) {
        logger_1.default.error("Error in systemScanHistory:", err);
        res.status(500).json({ status: false, message: `Error Fetching Scan History: ${err}` });
    }
});
exports.systemScanHistory = systemScanHistory;
// Fetch revalidate_history from selected DB
const systemRevalidateHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection, genericModel: RevalidateHistory } = yield (0, exports.connectToDB)("revalidate_history", "system");
        const { filter, limit, page } = req.body;
        const skip = (page - 1) * limit;
        let records;
        if (filter) {
            records = yield RevalidateHistory.find(filter).sort({ date: -1 }).skip(skip).limit(limit).exec();
        }
        else {
            records = yield RevalidateHistory.find().sort({ date: -1 }).skip(skip).limit(limit).exec();
        }
        res.json({ status: true, data: records });
        yield connection.close();
    }
    catch (err) {
        logger_1.default.error("Error in systemRevalidateHistories:", err);
        res.status(500).json({ status: false, message: `Error Fetching Revalidate Histories: ${err}` });
    }
});
exports.systemRevalidateHistories = systemRevalidateHistories;
// Fetch revalidate_history by scanId
const systemRevalidateHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection, genericModel: RevalidateHistory } = yield (0, exports.connectToDB)("revalidate_history", "system");
        const scanId = req.params.scanId;
        const record = yield RevalidateHistory.find({ scan_id: scanId }).exec();
        res.json({ status: true, data: record });
        yield connection.close();
    }
    catch (err) {
        logger_1.default.error("Error in systemRevalidateHistory:", err);
        res.status(500).json({ status: false, message: `Error Fetching matched Revalidate History: ${err}` });
    }
});
exports.systemRevalidateHistory = systemRevalidateHistory;
const systemServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection, genericModel: Server } = yield (0, exports.connectToDB)("server", "system");
        const records = yield Server.find().exec();
        res.json({ status: true, data: records });
        yield connection.close();
    }
    catch (err) {
        logger_1.default.error(`Error in systemServers: ${err}`);
        res.status(500).send({ status: false, message: `Error Fetching system servers: ${err}` });
    }
});
exports.systemServers = systemServers;
