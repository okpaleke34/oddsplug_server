import { IUser, IUserOptional } from "../mongodb/models/user.model";

export interface IUserRepository {
  create(setting: IUserOptional): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findByAggregate(aggregate: any): Promise<IUser[]>;
  findSelection(filter:IUserOptional): Promise<IUser[]>;
  update(filter:IUserOptional, setting: IUserOptional): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>
}