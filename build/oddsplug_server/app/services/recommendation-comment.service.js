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
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../infrastructure/index"));
class RecommendationCommentService {
    createRecommendationComment(recommendationComment) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.create(recommendationComment);
        });
    }
    getRecommendationCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.findById(id);
        });
    }
    getRecommendationComment(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.findSelection(filter);
        });
    }
    getRecommendationComments(recommendationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.getAggregate([
                // Match comments by recommendationId and status
                {
                    $match: {
                        recommendationId: new mongoose_1.default.Types.ObjectId(recommendationId),
                        status: 1, // Ensure comments have a status of 1
                    },
                },
                // Lookup to get the comment author's username
                {
                    $lookup: {
                        from: 'auths',
                        localField: 'authId',
                        foreignField: '_id',
                        as: 'commentUser',
                    },
                },
                {
                    $unwind: {
                        path: '$commentUser',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // Filter replies with status 1
                {
                    $addFields: {
                        replies: {
                            $filter: {
                                input: '$replies',
                                as: 'reply',
                                cond: { $eq: ['$$reply.status', 1] },
                            },
                        },
                    },
                },
                // Lookup to get the reply authors' usernames
                {
                    $unwind: {
                        path: '$replies',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'auths',
                        localField: 'replies.authId',
                        foreignField: '_id',
                        as: 'replyUser',
                    },
                },
                {
                    $unwind: {
                        path: '$replyUser',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        recommendationId: { $first: '$recommendationId' },
                        message: { $first: '$message' },
                        date: { $first: '$date' },
                        status: { $first: '$status' },
                        user: { $first: '$commentUser.username' },
                        replies: {
                            $push: {
                                _id: '$replies._id',
                                message: '$replies.message',
                                date: '$replies.date',
                                user: '$replyUser.username',
                            },
                        },
                    },
                },
                // Exclude empty reply arrays (optional)
                {
                    $match: {
                        replies: { $ne: [] },
                    },
                },
                // Sort comments by date (optional)
                {
                    $sort: {
                        date: -1,
                    },
                },
            ]);
            return comments;
        });
    }
    getAllRecommendationComment() {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.findAll();
        });
    }
    getAggregate(aggregate) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.findByAggregate(aggregate);
        });
    }
    updateRecommendationComment(filter, recommendationComment) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.update(filter, recommendationComment);
        });
    }
    deleteRecommendationComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return index_1.default.recommendationComment.delete(id);
        });
    }
}
exports.default = RecommendationCommentService;
