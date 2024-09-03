import { ISubscription, ISubscriptionOptional } from "../mongodb/models/subscription.model";

export interface ISubscriptionRepository {
  create(arbitrage: ISubscriptionOptional): Promise<ISubscription>;
  findById(id: string): Promise<ISubscription | null>;
  findAll(): Promise<ISubscription[]>;
  findByAggregate(aggregate: any): Promise<ISubscription[]>;
  findSelection(filter:ISubscriptionOptional): Promise<ISubscription[]>;
  update(filter:ISubscriptionOptional, arbitrage: ISubscriptionOptional): Promise<ISubscription | null>;
  delete(id: string): Promise<ISubscription | null>
}