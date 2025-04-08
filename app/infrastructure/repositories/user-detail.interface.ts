import { IUserDetail, IUserDetailOptional } from "../mongodb/models/user-detail.model";

export interface IUserDetailRepository {
  create(setting: IUserDetailOptional): Promise<IUserDetail>;
  findById(id: string): Promise<IUserDetail | null>;
  findAll(): Promise<IUserDetail[]>;
  findByAggregate(aggregate: any): Promise<IUserDetail[]>;
  findSelection(filter:IUserDetailOptional): Promise<IUserDetail[]>;
  update(filter:IUserDetailOptional, setting: IUserDetailOptional): Promise<IUserDetail | null>;
  delete(id: string): Promise<IUserDetail | null>
}