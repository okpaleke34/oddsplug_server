"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPlans = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.defaultPlans = [
    {
        "name": "7 days",
        "cost": [
            {
                "amount": 5000,
                "currency": "NGN",
                "country": "Nigeria"
            },
            {
                "amount": 50,
                "currency": "GHS",
                "country": "Ghana"
            }
        ],
        "description": "7 days access to all features",
        "durationInDays": 7,
        "status": 1
    },
    {
        "name": "30 days",
        "cost": [
            {
                "amount": 15000,
                "currency": "NGN",
                "country": "Nigeria"
            },
            {
                "amount": 150,
                "currency": "GHS",
                "country": "Ghana"
            }
        ],
        "description": "30 days access to all features",
        "durationInDays": 30,
        "status": 1
    }
];
const planSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    cost: { type: Array, required: true },
    description: { type: String, required: true },
    durationInDays: { type: String, required: true },
    status: { type: Number, required: true, default: 1, comment: "0: not active, 1:active;" },
}, { timestamps: true });
exports.default = mongoose_1.default.model('plan', planSchema);
