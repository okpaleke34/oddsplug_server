import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IExclusionRuleOptional = Partial<IExclusionRule>;

type IRule = {
  scanId: string;
  marketCode: string;
  bookmaker: string;
  sport: string;
  matchId: string;
  gameType: string;
  arbId: string;
}

export interface IExclusionRule extends Document {
  name: string;
  rule: IRule;
  adminId: string;
  durationInDays: string;
  status: number;
}

const exclusionRuleSchema: Schema = new Schema({
    name: { type: String, required: true },
    rule: { type: Object, required: true },
    adminId: { type: String, required: true },
    status: { type: Number, required: true, default:1, comment:"-1: deleted; 0: not active, 1:active;"},
},
{ timestamps: true }
);

export default mongoose.model<IExclusionRule>('exclusion_rule', exclusionRuleSchema);