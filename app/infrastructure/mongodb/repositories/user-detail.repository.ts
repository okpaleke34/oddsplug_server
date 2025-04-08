import UserDetail, { IUserDetail, IUserDetailOptional } from '../models/user-detail.model';
import { FilterQuery } from 'mongoose';
import { IUserDetailRepository } from '../../repositories/user-detail.interface';


export class UserDetailRepository implements IUserDetailRepository {
  
  public async create(userDetail: IUserDetail): Promise<IUserDetail> {
    const newUserDetail = await UserDetail.create(userDetail);
    return newUserDetail
  }

  public async findById(id: string): Promise<IUserDetail | null> {
    return UserDetail.findById(id).exec();
  }

  public async findAll(): Promise<IUserDetail[]> {
    return UserDetail.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IUserDetail[]> {
    return UserDetail.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IUserDetailOptional): Promise<IUserDetail[]> {
    const filterQuery: FilterQuery<IUserDetail> = filter as FilterQuery<IUserDetail>;
    return UserDetail.find(filterQuery).exec();
  }

  public async update(filter:IUserDetailOptional, userDetail: IUserDetailOptional): Promise<IUserDetail | null> {   
    const filterQuery: FilterQuery<IUserDetail> = filter as FilterQuery<IUserDetail>; 
    const updated = await UserDetail.findOneAndUpdate(filterQuery, userDetail, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IUserDetailOptional, userDetail: IUserDetailOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IUserDetail> = filter as FilterQuery<IUserDetail>; 
    const updated = await UserDetail.updateMany(filterQuery, userDetail).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IUserDetail | null> {
    return UserDetail.findByIdAndDelete(id).exec();
  }
}

