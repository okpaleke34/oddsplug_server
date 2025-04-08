import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IUserBetOptional = Partial<IUserBet>;

type ICalculatorValues = {
    odd: number;
    wager: number;
}

export interface IUserBet extends Document {
    authId: mongoose.Types.ObjectId;
    betId: mongoose.Types.ObjectId;
    betType: string; //"arbitrage" | "valuebet" | "middlebet";
    historyLength: number; //so these are number of history of the bet, if the history number is no the same when looking of it, it means that the bet has been updated and should be found in the history[historyLength]
    calculatorValues: ICalculatorValues[];
    status: number; // -1: deleted, 1:visible;
}

const userBetSchema: Schema = new Schema({
    authId: { type: mongoose.Types.ObjectId, ref: 'Authentication', required: true },
    betId: { type: mongoose.Types.ObjectId, required: true },
    betType: { type: String, required: true, comment:"The collection to find the opportunity eg arbitrage, valuebet, middlebet" },
    historyLength: { type: Number, required: false, default:null, comment:"So these are number of history of the bet, if the history number is no the same when looking of it, it means that the bet has been updated and should be found in the history[historyLength]" },
    calculatorValues: { type: Object, required: true, comment:"The final value in the calculator" },
    status: { type: Number, required: true, default:1, comment:"-1: deleted, 1:visible"}
},
{ timestamps: true }
);

export default mongoose.model<IUserBet>('user_bet', userBetSchema);