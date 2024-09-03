import { IAuth, IAuthOptional } from "../mongodb/models/auth.model";

export interface IAuthRepository {
  create(arbitrage: IAuthOptional): Promise<IAuth>;
  findById(id: string): Promise<IAuth | null>;
  findAll(): Promise<IAuth[]>;
  findByAggregate(aggregate: any): Promise<IAuth[]>;
  findSelection(filter:IAuthOptional): Promise<IAuth[]>;
  update(filter:IAuthOptional, arbitrage: IAuthOptional): Promise<IAuth | null>;
  delete(id: string): Promise<IAuth | null>
}