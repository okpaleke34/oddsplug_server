import { IMatchedMarket, IMatchedMarketOptional } from "../mongodb/models/matched-market.model";

export interface IMatchedMarketRepository {
  create(arbitrage: IMatchedMarketOptional): Promise<IMatchedMarket>;
  findById(id: string): Promise<IMatchedMarket | null>;
  findAll(): Promise<IMatchedMarket[]>;
  findByAggregate(aggregate: any): Promise<IMatchedMarket[]>;
  findSelection(filter:IMatchedMarketOptional): Promise<IMatchedMarket[]>;
  update(filter:IMatchedMarketOptional, arbitrage: IMatchedMarketOptional): Promise<IMatchedMarket | null>;
  delete(id: string): Promise<IMatchedMarket | null>
}