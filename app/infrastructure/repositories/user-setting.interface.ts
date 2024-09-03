import { IUserSetting, IUserSettingOptional } from "../mongodb/models/user-setting.model";

export interface IUserSettingRepository {
  create(userSetting: IUserSettingOptional): Promise<IUserSetting>;
  findById(id: string): Promise<IUserSetting | null>;
  findAll(): Promise<IUserSetting[]>;
  findSelection(filter:IUserSettingOptional): Promise<IUserSetting[]>;
  update(filter:IUserSettingOptional, userSetting: IUserSettingOptional): Promise<IUserSetting | null>;
  delete(id: string): Promise<IUserSetting | null>
}