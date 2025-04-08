import db from '../infrastructure/index';
import { IExclusionRule,IExclusionRuleOptional } from '../infrastructure/mongodb/models/exclusion-rule.model';


export default class ExclusionRuleService {

  public async createExclusionRule(exclusionRule: IExclusionRuleOptional): Promise<IExclusionRule> {
    return db.exclusionRule.create(exclusionRule);
  }

  public async getExclusionRuleById(id: string): Promise<IExclusionRule | null> {
    return db.exclusionRule.findById(id);
  }


  public async getExclusionRule(filter: IExclusionRuleOptional): Promise<IExclusionRule[]> {
    return db.exclusionRule.findSelection(filter);
  }

  public async getAllExclusionRule(): Promise<IExclusionRule[]> {
    return db.exclusionRule.findAll();
  }

  public async updateExclusionRule(filter:any, exclusionRule: IExclusionRuleOptional): Promise<IExclusionRule | null> {
    return db.exclusionRule.update(filter, exclusionRule);
  }

  public async deleteExclusionRule(id: string): Promise<IExclusionRule | null> {
    return db.exclusionRule.delete(id);
  }
}