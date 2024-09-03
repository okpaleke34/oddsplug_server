import Auth, { IAuth, IAuthOptional } from '../models/auth.model';
import { FilterQuery } from 'mongoose';
import { IAuthRepository } from '../../repositories/auth.interface';


export class AuthRepository implements IAuthRepository {
  
  public async create(auth: IAuth): Promise<IAuth> {
    const newAuth = await Auth.create(auth);
    return newAuth
  }

  public async findById(id: string): Promise<IAuth | null> {
    return Auth.findById(id).exec();
  }

  public async findAll(): Promise<IAuth[]> {
    return Auth.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IAuth[]> {
    return Auth.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IAuthOptional): Promise<IAuth[]> {
    const filterQuery: FilterQuery<IAuth> = filter as FilterQuery<IAuth>;
    return Auth.find(filterQuery).exec();
  }

  public async update(filter:IAuthOptional, auth: IAuthOptional): Promise<IAuth | null> {   
    const filterQuery: FilterQuery<IAuth> = filter as FilterQuery<IAuth>; 
    const updated = await Auth.findOneAndUpdate(filterQuery, auth, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IAuthOptional, auth: IAuthOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IAuth> = filter as FilterQuery<IAuth>; 
    const updated = await Auth.updateMany(filterQuery, auth, { upsert: true }).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IAuth | null> {
    return Auth.findByIdAndDelete(id).exec();
  }
}

