import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IRecommendationCommentOptional = Partial<IRecommendationComment>;

type IReply = {
    authId: mongoose.Types.ObjectId;
    message: string;
    status: number;
    date: Date;
}

export interface IRecommendationComment extends Document {
    authId: mongoose.Types.ObjectId;
    recommendationId: mongoose.Types.ObjectId;
    message: string;
    replies: IReply[];
    date: Date;
    status: number;
    $push: any;
}

const recommendationCommentSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Authentication', required: true },
    recommendationId: { type: mongoose.Types.ObjectId, required: true },
    message: { type: String, required: true },
    replies: { type: Array, required: true, default:[] },
    date: { type: Date, required: false, default: new Date() },
    status: { type: Number, required: true, default:0, comment:"-1: deleted, 0: new, 1:read;"},
},
{ timestamps: true }
);

export default mongoose.model<IRecommendationComment>('recommendation_comment', recommendationCommentSchema);