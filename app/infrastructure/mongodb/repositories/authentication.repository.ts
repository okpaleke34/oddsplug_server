import Authentication, { IAuthentication, IAuthenticationOptional } from '../models/authentication.model';
import { FilterQuery } from 'mongoose';
import { IAuthenticationRepository } from '../../repositories/authentication.interface';


export class AuthenticationRepository implements IAuthenticationRepository {
  
  public async create(authentication: IAuthentication): Promise<IAuthentication> {
    const newAuthentication = await Authentication.create(authentication);
    return newAuthentication
  }

  public async findById(id: string): Promise<IAuthentication | null> {
    return Authentication.findById(id).exec();
  }

  public async findAll(): Promise<IAuthentication[]> {
    return Authentication.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IAuthentication[]> {
    return Authentication.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IAuthenticationOptional): Promise<IAuthentication[]> {
    const filterQuery: FilterQuery<IAuthentication> = filter as FilterQuery<IAuthentication>;
    return Authentication.find(filterQuery).exec();
  }

  public async update(filter:IAuthenticationOptional, auth: IAuthenticationOptional): Promise<IAuthentication | null> {   
    const filterQuery: FilterQuery<IAuthentication> = filter as FilterQuery<IAuthentication>; 
    const updated = await Authentication.findOneAndUpdate(filterQuery, auth, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IAuthenticationOptional, auth: IAuthenticationOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IAuthentication> = filter as FilterQuery<IAuthentication>; 
    const updated = await Authentication.updateMany(filterQuery, auth).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IAuthentication | null> {
    return Authentication.findByIdAndDelete(id).exec();
  }
}

