import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IUserSettingOptional = Partial<IUserSetting>;

type IClonedBookmaker = {
    parent: string; // this wil be the idName of the parent eg _1xbet
    bookmaker: string; // this wil be the idName of the preferred clone eg 22bet
    customURL: string; //like 22bet.uk
}
export interface IUserSetting extends Document {
    authId: mongoose.Types.ObjectId;
    arbitrageAlert: number;
    oddType: string;
    clonedBookmakers: IClonedBookmaker[];
    bookmakers: string[];
    sports: string[];
    timezone: string;
    country: string;
}

const userSettingSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Auth', required: true },
    // arbitrageAlert: { type: Schema.Types.Decimal128, required: false },
    arbitrageAlert: { type: Number, required: false },
    oddType: { type: String, required: false },
    clonedBookmakers: { type: Object, required: false, default:[] },
    bookmakers: { type: Array, required: false },
    sports: { type: Array, required: false },
    timezone: { type: Object, required: false },
    country: { type: Object, required: false }
},
{ timestamps: true }
);

export default mongoose.model<IUserSetting>('UserSetting', userSettingSchema);