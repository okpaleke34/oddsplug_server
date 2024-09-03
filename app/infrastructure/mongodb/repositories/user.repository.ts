import User, { IUser, IUserOptional } from '../models/user.model';
import { FilterQuery } from 'mongoose';
import { IUserRepository } from '../../repositories/user.interface';


export class UserRepository implements IUserRepository {
  
  public async create(user: IUser): Promise<IUser> {
    const newUser = await User.create(user);
    return newUser
  }

  public async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  public async findAll(): Promise<IUser[]> {
    return User.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IUser[]> {
    return User.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IUserOptional): Promise<IUser[]> {
    const filterQuery: FilterQuery<IUser> = filter as FilterQuery<IUser>;
    return User.find(filterQuery).exec();
  }

  public async update(filter:IUserOptional, user: IUserOptional): Promise<IUser | null> {   
    const filterQuery: FilterQuery<IUser> = filter as FilterQuery<IUser>; 
    const updated = await User.findOneAndUpdate(filterQuery, user, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IUserOptional, user: IUserOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IUser> = filter as FilterQuery<IUser>; 
    const updated = await User.updateMany(filterQuery, user, { upsert: true }).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id).exec();
  }
}

