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
exports.UserDetailRepository = void 0;
const user_detail_model_1 = __importDefault(require("../models/user-detail.model"));
class UserDetailRepository {
    create(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserDetail = yield user_detail_model_1.default.create(userDetail);
            return newUserDetail;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_detail_model_1.default.findById(id).exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_detail_model_1.default.find().exec();
        });
    }
    findByAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_detail_model_1.default.aggregate(aggregate).exec();
        });
    }
    findSelection(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            return user_detail_model_1.default.find(filterQuery).exec();
        });
    }
    update(filter, userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            const updated = yield user_detail_model_1.default.findOneAndUpdate(filterQuery, userDetail, { new: true }).exec();
            return updated;
        });
    }
    updateMany(filter, userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            const updated = yield user_detail_model_1.default.updateMany(filterQuery, userDetail).exec();
            return updated.modifiedCount;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_detail_model_1.default.findByIdAndDelete(id).exec();
        });
    }
}
exports.UserDetailRepository = UserDetailRepository;
