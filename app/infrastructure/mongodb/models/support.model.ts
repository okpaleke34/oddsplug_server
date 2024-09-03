import mongoose, { Document, Schema } from 'mongoose';

export type ISupportOptional = Partial<ISupport>;

export interface ISupport extends Document {
    fullName: string;
    email: string;
    subject: string;
    message: string;
    status: number;
    repliedBy: string;
    IPAddress: string;
}

const supportSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, required: true, default:0, comment:"-1: deleted, 0: new, 1:read;"},
    repliedBy: { type: String, required: false, default:null, comment:"This is the authId of the admin that replied the email" },
    IPAddress: { type: String, required: false },
},
{ timestamps: true }
);

export default mongoose.model<ISupport>('Support', supportSchema);