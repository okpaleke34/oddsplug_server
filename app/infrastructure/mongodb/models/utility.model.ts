import mongoose, { Document, Schema } from 'mongoose';

export interface IUtility extends Document {
    name: string;
    data: object;
}

const utilitySchema: Schema = new Schema({
    name: { type: String, required: false },
    data: { type: Object, required: false }
});

export default mongoose.model<IUtility>('Utility', utilitySchema);