import mongoose, { Document, Schema } from 'mongoose';

export interface IUtility extends Document {
    name: string;
    type: string;
    sport: string;
    data: object;
}

const utilitySchema: Schema = new Schema({
    name: { type: String, required: false },
    type: { type: String, required: false },
    sport: { type: String, required: false },
    data: { type: Object, required: false }
});

export default mongoose.model<IUtility>('utility', utilitySchema);