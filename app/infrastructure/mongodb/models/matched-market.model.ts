import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export type IMatchedMarketOptional = Partial<IMatchedMarket>;


export interface IMatchedMarket extends Document {
    sport: string;
    bookmaker: string;
    bookmakerMarket: string;
    ourMarketMock: string;
    ourMarketDefinition: string;
    matchedMarkets: object;
    translatedMarkets: object[];
    status: number; // -1: hide, 1:visible;
}

const matchedMarketSchema: Schema = new Schema({
    sport: { type: String, required: true, comment:"eg football" },
    bookmaker: { type: String, required: true, comment:"eg bet9ja" },
    bookmakerMarket: { type: String, required: true, comment:"Filename of bookmaker sport market eg bet9ja.football.json" },
    ourMarketMock: { type: String, required: true, comment:"Filename of our market mock eg football.mock.json" },
    ourMarketDefinition: { type: String, required: true, comment:"Filename of our market definition eg football.definition.json" },
    matchedMarkets: { type: Object, required: true, comment:"matched markets done by admin" },
    translatedMarkets: { type: Object, required: true, comment:"bookmaker translated markets done by the dependency injection function and edited by admin" },
    status: { type: Number, required: true, default:1, comment:"-1: hide, 1:visible"}
},
{ timestamps: true }
);

export default mongoose.model<IMatchedMarket>('matched_market', matchedMarketSchema);