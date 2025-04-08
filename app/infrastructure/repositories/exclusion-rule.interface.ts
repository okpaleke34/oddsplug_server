import { IExclusionRule, IExclusionRuleOptional } from "../mongodb/models/exclusion-rule.model";

export interface IExclusionRuleRepository {
  create(arbitrage: IExclusionRuleOptional): Promise<IExclusionRule>;
  findById(id: string): Promise<IExclusionRule | null>;
  findAll(): Promise<IExclusionRule[]>;
  findByAggregate(aggregate: any): Promise<IExclusionRule[]>;
  findSelection(filter:IExclusionRuleOptional): Promise<IExclusionRule[]>;
  update(filter:IExclusionRuleOptional, arbitrage: IExclusionRuleOptional): Promise<IExclusionRule | null>;
  delete(id: string): Promise<IExclusionRule | null>
}