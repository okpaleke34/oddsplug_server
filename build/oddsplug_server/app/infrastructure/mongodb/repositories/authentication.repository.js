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
exports.AuthenticationRepository = void 0;
const authentication_model_1 = __importDefault(require("../models/authentication.model"));
class AuthenticationRepository {
    create(authentication) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAuthentication = yield authentication_model_1.default.create(authentication);
            return newAuthentication;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return authentication_model_1.default.findById(id).exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return authentication_model_1.default.find().exec();
        });
    }
    findByAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return authentication_model_1.default.aggregate(aggregate).exec();
        });
    }
    findSelection(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            return authentication_model_1.default.find(filterQuery).exec();
        });
    }
    update(filter, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            const updated = yield authentication_model_1.default.findOneAndUpdate(filterQuery, auth, { new: true }).exec();
            return updated;
        });
    }
    updateMany(filter, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = filter;
            const updated = yield authentication_model_1.default.updateMany(filterQuery, auth).exec();
            return updated.modifiedCount;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return authentication_model_1.default.findByIdAndDelete(id).exec();
        });
    }
}
exports.AuthenticationRepository = AuthenticationRepository;
