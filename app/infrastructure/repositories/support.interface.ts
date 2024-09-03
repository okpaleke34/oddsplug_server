import { ISupport, ISupportOptional } from "../mongodb/models/support.model";

export interface ISupportRepository {
  create(arbitrage: ISupportOptional): Promise<ISupport>;
  findById(id: string): Promise<ISupport | null>;
  findAll(): Promise<ISupport[]>;
  findByAggregate(aggregate: any): Promise<ISupport[]>;
  findSelection(filter:ISupportOptional): Promise<ISupport[]>;
  update(filter:ISupportOptional, arbitrage: ISupportOptional): Promise<ISupport | null>;
  delete(id: string): Promise<ISupport | null>
}