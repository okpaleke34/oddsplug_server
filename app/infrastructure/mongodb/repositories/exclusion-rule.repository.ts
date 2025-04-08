import ExclusionRule, { IExclusionRule, IExclusionRuleOptional } from '../models/exclusion-rule.model';
import { FilterQuery } from 'mongoose';
import { IExclusionRuleRepository } from '../../repositories/exclusion-rule.interface';


export class ExclusionRuleRepository implements IExclusionRuleRepository {
  
  public async create(exclusionRule: IExclusionRule): Promise<IExclusionRule> {
    const newExclusionRule = await ExclusionRule.create(exclusionRule);
    return newExclusionRule
  }

  public async findById(id: string): Promise<IExclusionRule | null> {
    return ExclusionRule.findById(id).exec();
  }

  public async findAll(): Promise<IExclusionRule[]> {
    return ExclusionRule.find().sort({updatedAt:-1}).exec();
  }

  public async findByAggregate(aggregate: any): Promise<IExclusionRule[]> {
    return ExclusionRule.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IExclusionRuleOptional): Promise<IExclusionRule[]> {
    const filterQuery: FilterQuery<IExclusionRule> = filter as FilterQuery<IExclusionRule>;
    return ExclusionRule.find(filterQuery).exec();
  }

  public async update(filter:IExclusionRuleOptional, exclusionRule: IExclusionRuleOptional): Promise<IExclusionRule | null> {   
    const filterQuery: FilterQuery<IExclusionRule> = filter as FilterQuery<IExclusionRule>; 
    const updated = await ExclusionRule.findOneAndUpdate(filterQuery, exclusionRule, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IExclusionRuleOptional, exclusionRule: IExclusionRuleOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IExclusionRule> = filter as FilterQuery<IExclusionRule>; 
    const updated = await ExclusionRule.updateMany(filterQuery, exclusionRule).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IExclusionRule | null> {
    return ExclusionRule.findByIdAndDelete(id).exec();
  }
}

