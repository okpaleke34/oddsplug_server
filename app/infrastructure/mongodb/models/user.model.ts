import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IUserOptional = Partial<IUser>;

export interface Address {
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
}

export interface IUser extends Document {
    authId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    level: string;
    dob: string;
    address: Address;
    settings: object;
    referral: string;
    affiliateCode: string;
    access: string;
    lastLogin: string;
    lastSeen: string;
    lastIP: string;
    registeredIP: string;
    registeredOn: string;
}

const userSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Auth', required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    country: { type: String, required: false },
    level: { type: String, required: false },
    dob: { type: String, required: false },
    address: { type: Object, required: false },
    settings: { type: Object, required: false },
    referral: { type: String, required: false },
    affiliateCode: { type: String, required: false, comment:"If a user has an affiliate code it means they are influencer that can share their code" },
    access: { type: String, required: false },
    lastLogin: { type: String, required: false },
    lastSeen: { type: String, required: false },
    lastIP: { type: String, required: false },
    registeredIP: { type: String, required: false },
    registeredOn: { type: String, required: false },
},
{ timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);