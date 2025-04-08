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
const index_1 = __importDefault(require("../infrastructure/index"));
class UserBetService {
    createUserBet(userBet) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.create(userBet);
        });
    }
    getUserBetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.findById(id);
        });
    }
    getBetHistories(filter, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getAggregate([
                {
                    $match: filter,
                },
                { $limit: limit }, // Limit the result to 10 documents
                {
                    $lookup: {
                        from: 'arbitrages', // Arbitrage collection name
                        localField: 'betId',
                        foreignField: '_id',
                        as: 'matchInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$matchInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        'matchInfo.history': {
                            $cond: {
                                if: { $gt: ['$historyLength', 0] },
                                then: { $arrayElemAt: ['$matchInfo.history', '$historyLength'] },
                                else: { $arrayElemAt: ['$matchInfo.history', 0] },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        authId: 1,
                        betId: 1,
                        betType: 1,
                        historyLength: 1,
                        calculatorValues: 1,
                        status: 1,
                        createdAt: 1,
                        matchInfo: {
                            tournament: 1,
                            marketCode: 1,
                            arbPercentage: 1,
                            bookmakers: 1,
                            firstScannedAt: 1,
                            sport: 1,
                            startAt: 1,
                            history: 1,
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ]);
            return results;
        });
    }
    getUserBet(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.findSelection(filter);
        });
    }
    getAllUserBet() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.findAll();
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.findByAggregate(aggregate);
        });
    }
    updateUserBet(filter, userBet) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.update(filter, userBet);
        });
    }
    deleteUserBet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userBet.delete(id);
        });
    }
}
exports.default = UserBetService;
