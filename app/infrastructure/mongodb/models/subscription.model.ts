import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type ISubscriptionOptional = Partial<ISubscription>;


export interface ISubscription extends Document {
    authId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    transactionId: string;
    paymentMethod: string;
    transactionData: any;
    paymentDate: Date;
    IPAddress: string;
    status: number;
}

const subscriptionSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Authentication', required: true },
    planId: { type: mongoose.Types.ObjectId, ref: 'Plan', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    transactionId: { type: String, required: false, default:null, comment:"The transaction Id from the payment gateway" },
    paymentMethod: { type: String, required: false, default:null, comment:"Paystack, Opay, Stripe etc" },
    transactionData: { type: Object, required: false, default:null, comment:"Transaction response data from payment gateway" },
    paymentDate: { type: Date, required: true },
    IPAddress: { type: String, required: false },
    status: { type: Number, required: true, default:1, comment:"-2: failed, -1: suspended, 0: not active, 1:approved;"},
},
{ timestamps: true }
);

export default mongoose.model<ISubscription>('subscription', subscriptionSchema);