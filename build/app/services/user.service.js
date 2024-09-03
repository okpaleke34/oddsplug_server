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
class UserService {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.create(user);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.findById(id);
        });
    }
    getUser(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.findSelection(filter);
        });
    }
    getUserProfile(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getAggregate([
                {
                    // $match: { authId: filter.authId }
                    $match: filter
                },
                {
                    $lookup: {
                        from: 'auths', // Ensure this matches your Auth collection name
                        localField: 'authId',
                        foreignField: '_id',
                        as: 'auth'
                    }
                },
                {
                    $unwind: '$auth' // This will convert the auth array into a single object
                }
            ]);
            return result[0];
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.findByAggregate(aggregate);
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.findAll();
        });
    }
    updateUser(filter, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.update(filter, user);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.user.delete(id);
        });
    }
}
exports.default = UserService;
