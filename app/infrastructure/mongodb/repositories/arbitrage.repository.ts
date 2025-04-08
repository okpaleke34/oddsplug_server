import { IArbitrageRepository } from '../../repositories/arbitrage.interface';
import Arbitrage, { IArbitrage, IArbitrageOptional } from '../models/arbitrage.model';
import { FilterQuery } from 'mongoose';


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

  public async findSelection(filter:IArbitrageOptional): Promise<IArbitrage[]> {
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
      const filterQuery: FilterQuery<IArbitrage> = filter as FilterQuery<IArbitrage>;
      // console.log({filterQuery})
      // const results = await Arbitrage.find(filterQuery,{ history: 0 }).sort({ arbPercentage: -1 }).exec(); //The highest arb percentage first
      // const results = await Arbitrage.find(filterQuery,{ history: 0 }).sort({ arbPercentage: -1 }).exec().limit(100); //The highest arb percentage first
      const results = await Arbitrage.find(filterQuery,{ history: 0 }).sort({ startAt: 1 }).exec();//the  ones that will start early first
      // const results = await Arbitrage.find(filterQuery,{ history: 0 }).sort({ lastScannedAt: -1 }).exec(); //The latest scanned ones first
      // console.log(results.length)
      return results



      // const filterQuery: FilterQuery<IArbitrage> = filter as FilterQuery<IArbitrage>;
      // console.log({filterQuery})
      // return Arbitrage.find(filterQuery).exec();
      // return Arbitrage.find({sport,gameType}).exec();
      // return Arbitrage.find({sport,gameType:new RegExp(`^${gameType}$`, 'i') }).exec();
    }
    else
      return Arbitrage.find().exec();
  }
  
  public async findByAggregate(aggregate: any): Promise<any> {
    return Arbitrage.aggregate(aggregate).exec();
  }

  public async update(filter:IArbitrageOptional, plan: IArbitrageOptional): Promise<IArbitrage | null> {   
    const filterQuery: FilterQuery<IArbitrageOptional> = filter as FilterQuery<IArbitrageOptional>; 
    const updated = await Arbitrage.findOneAndUpdate(filterQuery, plan, { new: true }).exec();
    return updated;
  }

  public async updateMany(filter:IArbitrageOptional, arbitrage: IArbitrageOptional | any): Promise<number | null> {
    const filterQuery: FilterQuery<IArbitrage> = filter as FilterQuery<IArbitrage>;
    // const updated = await Arbitrage.updateMany(filterQuery, arbitrage, { upsert: true }).exec(); //This will create a new document if no document matches the filter
    const updated = await Arbitrage.updateMany(filterQuery, arbitrage).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IArbitrage | null> {
    return Arbitrage.findByIdAndDelete(id).exec();
  }
}
