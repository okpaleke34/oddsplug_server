import { IArbitrageRepository } from '../../repositories/arbitrage.interface';
import Arbitrage, { IArbitrage } from '../models/arbitrage.model';

export interface IArbitrage2{
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
  firstScannedAt: string;
  startAt: string;
  lastScannedAt: string;
  lastScanId: string;
  won?: number;
  result?: string;
  status: number;
}

export class ArbitrageRepository implements IArbitrageRepository {
  
  public async create(arbitrage: IArbitrage): Promise<IArbitrage> {
    const newArbitrage = await Arbitrage.create(arbitrage);
    return newArbitrage
  }

  public async findById(id: string): Promise<IArbitrage | null> {
    return Arbitrage.findById(id).exec();
  }

  public async findAll(): Promise<IArbitrage[]> {
    return Arbitrage.find().exec();
  }

  public async findSelection(filter:IArbitrage2): Promise<IArbitrage[]> {
    // return Arbitrage.find(detail).exec();
    // console.log({detail})
    // const {sport,gameType} = detail;
    if(filter){
      // const member = {sport,gameType}
      // return Arbitrage.find(member).exec();
      // console.log({filter})
      // if(filter.hasOwnProperty("sport") && filter.sport == "All"){
      //   delete filter.sport
      //   // delete filter["sport"]
      // }
      // console.log({filter})
      return Arbitrage.find(filter).exec();
      // return Arbitrage.find({sport,gameType}).exec();
      // return Arbitrage.find({sport,gameType:new RegExp(`^${gameType}$`, 'i') }).exec();
    }
    else
      return Arbitrage.find().exec();
  }

  public async update(filter:IArbitrage2, arbitrage: Partial<IArbitrage> | any): Promise<IArbitrage | null> {    
    const updated = await Arbitrage.findOneAndUpdate(filter, arbitrage, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IArbitrage2, arbitrage: Partial<IArbitrage> | any): Promise<number | null> {
    const updated = await Arbitrage.updateMany(filter, arbitrage, { upsert: true }).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IArbitrage | null> {
    return Arbitrage.findByIdAndDelete(id).exec();
  }
}
