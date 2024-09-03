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
exports.ArbitrageRepository = void 0;
const arbitrage_model_1 = __importDefault(require("../models/arbitrage.model"));
class ArbitrageRepository {
    create(arbitrage) {
        return __awaiter(this, void 0, void 0, function* () {
            const newArbitrage = yield arbitrage_model_1.default.create(arbitrage);
            return newArbitrage;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return arbitrage_model_1.default.findById(id).exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return arbitrage_model_1.default.find().exec();
        });
    }
    findSelection(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            // return Arbitrage.find(detail).exec();
            // console.log({detail})
            // const {sport,gameType} = detail;
            if (filter) {
                // const member = {sport,gameType}
                // return Arbitrage.find(member).exec();
                // console.log({filter})
                // if(filter.hasOwnProperty("sport") && filter.sport == "All"){
                //   delete filter.sport
                //   // delete filter["sport"]
                // }
                // console.log({filter})
                return arbitrage_model_1.default.find(filter).exec();
                // return Arbitrage.find({sport,gameType}).exec();
                // return Arbitrage.find({sport,gameType:new RegExp(`^${gameType}$`, 'i') }).exec();
            }
            else
                return arbitrage_model_1.default.find().exec();
        });
    }
    update(filter, arbitrage) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield arbitrage_model_1.default.findOneAndUpdate(filter, arbitrage, { new: true }).exec();
            return updated;
        });
    }
    updateMany(filter, arbitrage) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield arbitrage_model_1.default.updateMany(filter, arbitrage, { upsert: true }).exec();
            return updated.modifiedCount;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return arbitrage_model_1.default.findByIdAndDelete(id).exec();
        });
    }
}
exports.ArbitrageRepository = ArbitrageRepository;
