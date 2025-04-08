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
    createAuthentication(authentication) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.create(authentication);
        });
    }
    getAuthenticationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.findById(id);
        });
    }
    getAuthentication(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.findSelection(filter);
        });
    }
    getAllAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.findAll();
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.findByAggregate(aggregate);
        });
    }
    updateAuthentication(filter, authentication) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.update(filter, authentication);
        });
    }
    deleteAuthentication(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.authentication.delete(id);
        });
    }
    getArbitrageUsersSubscriptions(minimumAlert) {
        return __awaiter(this, void 0, void 0, function* () {
            // Aggregate pipeline to get users with active devices, active subscriptions and minimum alert greater than or equal to the minimumAlert
            const aggregate = [
                { $unwind: '$devices' }, // Deconstruct devices array to filter individual documents
                {
                    $match: {
                        'devices.status': 1,
                        'devices.notificationSubscription': { $ne: null }
                    }
                },
                // Lookup to join Authentication documents with UserSetting documents
                {
                    $lookup: {
                        from: 'usersettings', // Name of the UserSetting collection (make sure it's correct)
                        localField: '_id', // Field from Authentication collection
                        foreignField: 'authId', // Field from UserSetting collection
                        as: 'userSettings' // Output array field
                    }
                },
                // Unwind the userSettings array to work with individual user settings
                {
                    $unwind: '$userSettings'
                },
                // Match to filter only those userSettings where arbitrageAlert is greater than or equal to minimumAlert
                {
                    $match: {
                        'userSettings.arbitrageAlert': { $gte: minimumAlert }
                    }
                },
                // Lookup to join Authentication documents with Subscription documents
                {
                    $lookup: {
                        from: 'subscriptions', // Name of the Subscription collection
                        localField: '_id', // Field from Authentication collection
                        foreignField: 'authId', // Field from Subscription collection
                        as: 'subscriptions' // Output array field
                    }
                },
                // Unwind the subscriptions array to work with individual subscriptions
                {
                    $unwind: '$subscriptions'
                },
                // Match to filter only those subscriptions where status is 1
                {
                    $match: {
                        'subscriptions.status': 1
                    }
                },
                // Project the required fields
                {
                    $project: {
                        _id: 1,
                        'devices.notificationSubscription': 1,
                        // email: 1,
                    }
                }
            ];
            const results = yield this.getAggregate(aggregate);
            // console.log(results)
            if (results.length > 0) {
                const subscriptions = results.map(doc => {
                    if (doc.devices !== undefined) {
                        const devices = doc.devices;
                        return devices.notificationSubscription;
                    }
                });
                // console.log(subscriptions)
                return subscriptions;
            }
            return [];
        });
    }
    usersSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregate = [
                { $unwind: '$devices' }, // Deconstruct devices array to filter individual documents
                {
                    $match: {
                        'devices.status': 1,
                        'devices.notificationSubscription': { $ne: null }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        'devices.notificationSubscription': 1,
                        // 'email': 1 
                    }
                }
            ];
            const results = yield this.getAggregate(aggregate);
            if (results.length > 0) {
                return results.map(doc => {
                    if (doc.devices !== undefined) {
                        const devices = doc.devices;
                        return devices.notificationSubscription;
                    }
                });
            }
            return [];
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
                    const update = yield index_1.default.authentication.update({ _id: user._id }, { password: hashedPassword });
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
