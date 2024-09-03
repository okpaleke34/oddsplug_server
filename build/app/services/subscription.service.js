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
class SubscriptionService {
    createSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.create(subscription);
        });
    }
    getSubscriptionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.findById(id);
        });
    }
    getSubscription(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.findSelection(filter);
        });
    }
    getAllSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.findAll();
        });
    }
    getSubscriptionHistories(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getAggregate([
                {
                    $match: filter,
                },
                { $limit: 20 }, // Limit the result to 20 documents
                {
                    $lookup: {
                        from: 'plans', // Plans collection name
                        localField: 'planId',
                        foreignField: '_id',
                        as: 'plan',
                    },
                },
                {
                    $unwind: {
                        path: '$plan',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ]);
            return results;
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.findByAggregate(aggregate);
        });
    }
    updateSubscription(filter, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.update(filter, subscription);
        });
    }
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.subscription.delete(id);
        });
    }
    getAllActivePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.plan.findSelection({ status: 1 });
        });
    }
}
exports.default = SubscriptionService;
