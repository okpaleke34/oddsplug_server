import { IPlan, IPlanOptional } from "../mongodb/models/plan.model";

export interface IPlanRepository {
  create(arbitrage: IPlanOptional): Promise<IPlan>;
  findById(id: string): Promise<IPlan | null>;
  findAll(): Promise<IPlan[]>;
  findByAggregate(aggregate: any): Promise<IPlan[]>;
  findSelection(filter:IPlanOptional): Promise<IPlan[]>;
  update(filter:IPlanOptional, arbitrage: IPlanOptional): Promise<IPlan | null>;
  delete(id: string): Promise<IPlan | null>
}