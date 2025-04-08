import MatchedMarket, { IMatchedMarket, IMatchedMarketOptional } from '../models/matched-market.model';
import { FilterQuery } from 'mongoose';
import { IMatchedMarketRepository } from '../../repositories/matched-market.interface';

export class MatchedMarketRepository implements IMatchedMarketRepository {
  
  public async create(matchedMarket: IMatchedMarket): Promise<IMatchedMarket> {
    const newMatchedMarket = await MatchedMarket.create(matchedMarket);
    return newMatchedMarket
  }

  public async findById(id: string): Promise<IMatchedMarket | null> {
    return MatchedMarket.findById(id).exec();
  }

  public async findAll(): Promise<IMatchedMarket[]> {
    return MatchedMarket.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IMatchedMarket[]> {
    return MatchedMarket.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IMatchedMarketOptional): Promise<IMatchedMarket[]> {
    const filterQuery: FilterQuery<IMatchedMarket> = filter as FilterQuery<IMatchedMarket>;
    return MatchedMarket.find(filterQuery).exec();
  }

  public async update(filter:IMatchedMarketOptional, matchedMarket: IMatchedMarketOptional): Promise<IMatchedMarket | null> {   
    const filterQuery: FilterQuery<IMatchedMarket> = filter as FilterQuery<IMatchedMarket>; 
    const updated = await MatchedMarket.findOneAndUpdate(filterQuery, matchedMarket, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IMatchedMarketOptional, matchedMarket: IMatchedMarketOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IMatchedMarket> = filter as FilterQuery<IMatchedMarket>; 
    const updated = await MatchedMarket.updateMany(filterQuery, matchedMarket).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IMatchedMarket | null> {
    return MatchedMarket.findByIdAndDelete(id).exec();
  }
}

