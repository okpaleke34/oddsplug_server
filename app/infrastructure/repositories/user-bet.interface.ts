import { IUserBet, IUserBetOptional } from "../mongodb/models/user-bet.model";

export interface IUserBetRepository {
  create(arbitrage: IUserBetOptional): Promise<IUserBet>;
  findById(id: string): Promise<IUserBet | null>;
  findAll(): Promise<IUserBet[]>;
  findByAggregate(aggregate: any): Promise<IUserBet[]>;
  findSelection(filter:IUserBetOptional): Promise<IUserBet[]>;
  update(filter:IUserBetOptional, arbitrage: IUserBetOptional): Promise<IUserBet | null>;
  delete(id: string): Promise<IUserBet | null>
}