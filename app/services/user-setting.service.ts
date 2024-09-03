import db from '../infrastructure/index';
import { IUserSetting,IUserSettingOptional } from '../infrastructure/mongodb/models/user-setting.model';


export default class UserSettingService {

  public async createUserSetting(userSetting: IUserSettingOptional): Promise<IUserSetting> {
    return db.userSetting.create(userSetting);
  }

  public async getUserSettingById(id: string): Promise<IUserSetting | null> {
    return db.userSetting.findById(id);
  }


  public async getUserSetting(filter: IUserSettingOptional): Promise<IUserSetting[]> {
    return db.userSetting.findSelection(filter);
  }

  public async getAllUserSetting(): Promise<IUserSetting[]> {
    return db.userSetting.findAll();
  }

  public async updateUserSetting(filter:any, userSetting: IUserSettingOptional): Promise<IUserSetting | null> {
    return db.userSetting.update(filter, userSetting);
  }

  public async deleteUserSetting(id: string): Promise<IUserSetting | null> {
    return db.userSetting.delete(id);
  }
}