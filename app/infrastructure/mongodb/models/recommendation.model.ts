import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IRecommendationOptional = Partial<IRecommendation>;

type IVote = {
    authId: ObjectId;
    isUp: boolean;
    date: Date;
}

export interface IRecommendation extends Document {
    authId: mongoose.Types.ObjectId;
    topic: string;
    description: string;
    status: number;
    votes: IVote[];
    IPAddress: string;
    // $push: (votes: IVote) => void;
    $push: any;
}

const recommendationSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Auth', required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true, default:1, comment:"-1: deleted, 0: new, 1:approved;"},
    votes: { type: Array, required: false, default:[] },
    IPAddress: { type: String, required: false },
},
{ timestamps: true }
);

export default mongoose.model<IRecommendation>('recommendation', recommendationSchema);