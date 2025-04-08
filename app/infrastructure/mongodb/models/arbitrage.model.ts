import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import moment from 'moment-timezone';


export type IArbitrageOptional = Partial<IArbitrage>;
interface IBookmaker {
  bookmaker: string;
  teams: string;
  market: string;
  odd: number;
  odds: number[];
}
interface IHistory {
  scannedAt: string;
  bookmakers: IBookmaker[];
  arbPercentage: string;
  scanId: string;
}

export interface IArbitrage extends Document {
  // _id?: mongoose.Types.ObjectId;
  tournament: string;
  marketCode: string;
  arbPercentage: string;
  arbId: string;
  arbStorageId: string;
  matchId: string;
  hash: string;
  scanId: string;
  sport: string;
  gameType: string;
  bookmakers: IBookmaker[];
  firstScannedAt: string;
  startAt: string;
  lastScannedAt: string;
  lastScanId: string;
  won?: number;
  result?: string;
  history?: IHistory[];
  status: number;
}

const arbitrageSchema: Schema = new Schema({
  tournament: { type: String, required: true },
  marketCode: { type: String, required: true, comment: 'ft_dnb' },
  arbPercentage: { type: Number, required: true, comment: '4.23' },
  arbId: { type: String, required: true, comment: 'MMHHDDMM-bookmarker1-bookmarker2-team1-team2-marketCode-gameType hashed' },
  matchId: { type: String, required: true, comment: 'MMHHDDMM-team1_bigchar/id-team2_bigchar/id hashed' },
  hash: { type: String, required: true, comment: 'Hash of match data' },
  arbStorageId: { type: String, required: true },
  scanId: { type: String, required: true },
  sport: { type: String, required: true, comment: 'Football' },
  gameType: { type: String, required: true, comment: 'Prematch,Live' },
  bookmakers: { type: [Object], comment: '{bookmaker:bet9ja,teams:Arsenal vs chelsea,market:ov,odd:2.3,odds:[2.3,1.5]}' },
  firstScannedAt: { type: String, required: true },
  startAt: { type:  String, required: true },
  lastScannedAt: { type: String, required: true },
  lastScanId: { type: String, required: true },
  won: { type: Number, comment: '0:money back; 1:first market won;2:second market won;3:third market won' },
  result: { type: String, comment: 'match result: 1-0' },
  history: { type: [Object], comment: '[{updatedAt, bookmakers,scanId}]', default: [] },
  status: { type: Number, required: true, default: 1, comment: '-1:expired(No longer in found in the website/odd changed);0:hidden(hidden by bot because 5mins>lastScannedAt);1:visible;2:hidden by admin(Do not update again)' }
},
{ timestamps: {
    currentTime: () => moment().tz('Africa/Lagos').toDate()
  } 
}
);

export default mongoose.model<IArbitrage>('Arbitrage', arbitrageSchema);
