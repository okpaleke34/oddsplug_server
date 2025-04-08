import { IAuthentication, IAuthenticationOptional } from "../mongodb/models/authentication.model";

export interface IAuthenticationRepository {
  create(arbitrage: IAuthenticationOptional): Promise<IAuthentication>;
  findById(id: string): Promise<IAuthentication | null>;
  findAll(): Promise<IAuthentication[]>;
  findByAggregate(aggregate: any): Promise<IAuthentication[]>;
  findSelection(filter:IAuthenticationOptional): Promise<IAuthentication[]>;
  update(filter:IAuthenticationOptional, arbitrage: IAuthenticationOptional): Promise<IAuthentication | null>;
  delete(id: string): Promise<IAuthentication | null>
}