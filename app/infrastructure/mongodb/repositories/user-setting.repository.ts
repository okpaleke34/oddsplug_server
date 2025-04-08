import UserSetting, { IUserSetting, IUserSettingOptional } from '../models/user-setting.model';
import { FilterQuery } from 'mongoose';
import { IUserSettingRepository } from '../../repositories/user-setting.interface';


export class UserSettingRepository implements IUserSettingRepository {
  
  public async create(userSetting: IUserSetting): Promise<IUserSetting> {
    const newUser = await UserSetting.create(userSetting);
    return newUser
  }

  public async findById(id: string): Promise<IUserSetting | null> {
    return UserSetting.findById(id).exec();
  }

  public async findAll(): Promise<IUserSetting[]> {
    return UserSetting.find().exec();
  }

  public async findSelection(filter:IUserSettingOptional): Promise<IUserSetting[]> {
    const filterQuery: FilterQuery<IUserSetting> = filter as FilterQuery<IUserSetting>;
    return UserSetting.find(filterQuery).exec();
  }

  public async update(filter:IUserSettingOptional, userSetting: IUserSettingOptional): Promise<IUserSetting | null> {   
    const filterQuery: FilterQuery<IUserSetting> = filter as FilterQuery<IUserSetting>; 
    const updated = await UserSetting.findOneAndUpdate(filterQuery, userSetting, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IUserSettingOptional, userSetting: IUserSettingOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IUserSetting> = filter as FilterQuery<IUserSetting>; 
    const updated = await UserSetting.updateMany(filterQuery, userSetting).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IUserSetting | null> {
    return UserSetting.findByIdAndDelete(id).exec();
  }
}

