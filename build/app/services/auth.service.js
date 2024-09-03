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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    createAuth(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.create(auth);
        });
    }
    getAuthById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.findById(id);
        });
    }
    getAuth(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.findSelection(filter);
        });
    }
    getAllAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.findAll();
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.findByAggregate(aggregate);
        });
    }
    updateAuth(filter, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.update(filter, auth);
        });
    }
    deleteAuth(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.auth.delete(id);
        });
    }
    changePassword(oldPassword, newPassword, confirmPassword, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!oldPassword || !newPassword || !confirmPassword) {
                    return { status: false, message: "All fields are required" };
                }
                if (newPassword !== confirmPassword) {
                    return { status: false, message: "Passwords do not match" };
                }
                const oldPasswordIsAccurate = yield bcryptjs_1.default.compare(oldPassword, user.password);
                if (oldPasswordIsAccurate) {
                    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                    const update = yield index_1.default.auth.update({ _id: user._id }, { password: hashedPassword });
                    if (update) {
                        return { status: true, message: "Password changed successfully" };
                    }
                    else {
                        return { status: false, message: "Error: your password was not changed, try again or use other means of support to reach us out" };
                    }
                }
                else {
                    return { status: false, message: "Old password is incorrect" };
                }
            }
            catch (error) {
                return { status: false, message: error.message };
            }
        });
    }
}
exports.default = AuthService;
