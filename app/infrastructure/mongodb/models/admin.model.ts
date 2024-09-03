import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface IAdmin extends Document {
    authId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    country: string;
    level: string;
    settings: object;
    referral: string;
    access: string;
    lastLogin: string;
    lastSeen: string;
    lastIP: string;
    registeredIP: string;
    registeredOn: string;
}

const adminSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Auth', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    country: { type: String, required: false },
    level: { type: String, required: false },
    settings: { type: Object, required: false },
    referral: { type: String, required: false },
    access: { type: String, required: false },
    lastLogin: { type: String, required: false },
    lastSeen: { type: String, required: false },
    lastIP: { type: String, required: false },
    registeredIP: { type: String, required: false },
    registeredOn: { type: String, required: false },
},
{ timestamps: true });

export default mongoose.model<IAdmin>('Admin', adminSchema);