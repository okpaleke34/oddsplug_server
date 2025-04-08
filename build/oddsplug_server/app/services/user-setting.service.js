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
class UserSettingService {
    createUserSetting(userSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.create(userSetting);
        });
    }
    getUserSettingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.findById(id);
        });
    }
    getUserSetting(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.findSelection(filter);
        });
    }
    getAllUserSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.findAll();
        });
    }
    updateUserSetting(filter, userSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.update(filter, userSetting);
        });
    }
    deleteUserSetting(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.userSetting.delete(id);
        });
    }
}
exports.default = UserSettingService;
