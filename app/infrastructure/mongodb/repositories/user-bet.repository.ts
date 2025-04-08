import UserBet, { IUserBet, IUserBetOptional } from '../models/user-bet.model';
import { FilterQuery } from 'mongoose';
import { IUserBetRepository } from '../../repositories/user-bet.interface';

export class UserBetRepository implements IUserBetRepository {
  
  public async create(userBet: IUserBet): Promise<IUserBet> {
    const newUserBet = await UserBet.create(userBet);
    return newUserBet
  }

  public async findById(id: string): Promise<IUserBet | null> {
    return UserBet.findById(id).exec();
  }

  public async findAll(): Promise<IUserBet[]> {
    return UserBet.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IUserBet[]> {
    return UserBet.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IUserBetOptional): Promise<IUserBet[]> {
    const filterQuery: FilterQuery<IUserBet> = filter as FilterQuery<IUserBet>;
    return UserBet.find(filterQuery).exec();
  }

  public async update(filter:IUserBetOptional, userBet: IUserBetOptional): Promise<IUserBet | null> {   
    const filterQuery: FilterQuery<IUserBet> = filter as FilterQuery<IUserBet>; 
    const updated = await UserBet.findOneAndUpdate(filterQuery, userBet, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IUserBetOptional, userBet: IUserBetOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IUserBet> = filter as FilterQuery<IUserBet>; 
    const updated = await UserBet.updateMany(filterQuery, userBet).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IUserBet | null> {
    return UserBet.findByIdAndDelete(id).exec();
  }
}

