import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IPlanOptional = Partial<IPlan>;

type IAmountSegmentation = {
    amount: number;
    currency: string;
    country: string;
}

export interface IPlan extends Document {
    name: string;
    cost: IAmountSegmentation[];
    description: string;
    durationInDays: number;
    status: number;
}

export const defaultPlans = [
    {
        "name": "7 days",
        "cost": [
          {
            "amount": 5000,
            "currency": "NGN",
            "country": "Nigeria"
          },
          {
            "amount": 50,
            "currency": "GHS",
            "country": "Ghana"
          }
        ],
        "description": "7 days access to all features",
        "durationInDays": 7,
        "status": 1
    },
    {
        "name": "30 days",
        "cost": [
          {
            "amount": 15000,
            "currency": "NGN",
            "country": "Nigeria"
          },
          {
            "amount": 150,
            "currency": "GHS",
            "country": "Ghana"
          }
        ],
        "description": "30 days access to all features",
        "durationInDays": 30,
        "status": 1
    }      
]

const planSchema: Schema = new Schema({
    name: { type: String, required: true },
    cost: { type: Array, required: true },
    description: { type: String, required: true },
    durationInDays: { type: String, required: true },
    status: { type: Number, required: true, default:1, comment:"0: not active, 1:active;"},
},
{ timestamps: true }
);

export default mongoose.model<IPlan>('plan', planSchema);